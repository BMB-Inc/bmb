import { createClientAsync, IOptions, Client as SoapClient } from "soap";
import { writeFileSync } from "fs";
import { join } from "path";
import { XMLParser } from "fast-xml-parser";
import { PoliciesSchema, SoapPoliciesSchema } from "@bmb-inc/types";
import { getCoverageCodeById } from "@bmb-inc/constants";
import { oaDateToJsDate } from "@bmb-inc/utils";

interface SagittaAuthHeader {
  Account?: string;
  Username?: string;
  Password?: string;
  Accesscode?: string;
  Serverpool?: string;
  Onlinecode?: string;
}

// Default auth header from environment variables
const authHeader: SagittaAuthHeader = {
  Account: process.env.SAGITTA_ACCOUNT,
  Username: process.env.SAGITTA_USERNAME,
  Password: process.env.SAGITTA_PASSWORD,
  Accesscode: process.env.SAGITTA_ACCESSCODE,
  Serverpool: process.env.SAGITTA_SERVERPOOL,
  Onlinecode: process.env.SAGITTA_ONLINECODE,
};

class SagittaSoapClient {
  private client: SoapClient | null = null;
  private authHeader: SagittaAuthHeader | null = null;
  private parser: XMLParser;

  private constructor() {
    // Private constructor to force use of static factory method
    this.parser = new XMLParser({ ignoreAttributes: false });
  }

  /**
   * Static factory method to create and initialize a SagittaSoapClient
   * @param wsdl WSDL URL (optional, will use environment variable if not provided)
   * @param authHeader Optional authentication header
   * @returns Promise that resolves to an initialized SagittaSoapClient
   */
  public static async create(
    wsdl?: string,
    authHeader?: SagittaAuthHeader
  ): Promise<SagittaSoapClient> {
    const instance = new SagittaSoapClient();
    await instance.initClient(wsdl);
    if (authHeader) {
      instance.setAuthenticationHeader(authHeader);
    }
    return instance;
  }

  private async initClient(wsdl?: string) {
    try {
      const wsdlUrl = wsdl || process.env.SAGITTA_SOAP_WSDL_URL;
      if (!wsdlUrl) {
        throw new Error(
          "SAGITTA_SOAP_WSDL_URL is not set. Check your environment variables or provide wsdl parameter."
        );
      }

      this.client = await createClientAsync(wsdlUrl, {
        wsdl_headers: {
          SOAPAction:
            "https://ws14.sagitta-online.com/sagittaws/transporter.asmx?op=PassThroughReq",
        },
      });
    } catch (error) {
      console.error("Failed to initialize SOAP client:", error);
      throw error;
    }
  }

  /**
   * Describes the WSDL structure as a JavaScript object
   * @returns JavaScript object representing services, ports, and methods
   */
  public describe() {
    if (!this.client) {
      throw new Error("SOAP client not initialized");
    }
    return this.client.describe();
  }

  /**
   * Pretty prints the WSDL structure for debugging
   */
  public printWsdlStructure() {
    const description = this.describe();
    return description;
  }

  /**
   * Writes the WSDL structure to a JSON file
   * @param filename Optional filename (defaults to 'wsdl-structure.json')
   * @param outputDir Optional output directory (defaults to current working directory)
   * @returns Path to the written file
   */
  public writeWsdlToFile(
    filename = "wsdl-structure.json",
    outputDir = process.cwd()
  ): string {
    const description = this.describe();
    const filePath = join(outputDir, filename);

    try {
      writeFileSync(filePath, JSON.stringify(description, null, 2), "utf8");
      console.log(`WSDL structure written to: ${filePath}`);
      return filePath;
    } catch (error) {
      console.error(`Failed to write WSDL structure to file: ${error}`);
      throw error;
    }
  }

  /**
   * Set authentication header for SOAP requests
   * @param authHeader Authentication header object
   */
  public setAuthenticationHeader(authHeader: SagittaAuthHeader) {
    if (!this.client) {
      throw new Error("SOAP client not initialized");
    }

    this.authHeader = authHeader;
    // Note: Authentication is handled in request body, not SOAP headers for Sagitta
  }

  /**
   * Build SOAP request with authentication in the body (Sagitta-specific format)
   * @param statement The SQL-like statement to execute
   * @returns Formatted request object
   */
  private buildSoapRequest(statement: string) {
    if (!this.authHeader) {
      throw new Error(
        "Authentication header not set. Call setAuthenticationHeader() first."
      );
    }

    return {
      XMLinput: {
        INPUT: {
          Account: {
            attributes: {
              value: this.authHeader.Account || "",
            },
          },
          Username: {
            attributes: {
              value: this.authHeader.Username || "",
            },
          },
          Password: {
            attributes: {
              value: this.authHeader.Password || "",
            },
          },
          Accesscode: {
            attributes: {
              value: this.authHeader.Accesscode || "",
            },
          },
          Serverpool: {
            attributes: {
              value: this.authHeader.Serverpool || "",
            },
          },
          Online: {
            attributes: {
              value: this.authHeader.Onlinecode || "",
            },
          },
          Access: {
            attributes: {
              statement,
            },
          },
        },
      },
    };
  }

  /**
   * Make a PassThroughReq call (Sagitta-specific method)
   * @param statement The SQL-like statement to execute
   * @returns Promise resolving to the parsed response
   */
  public async callPassThroughReq<T>(statement: string): Promise<T | T[]> {
    if (!this.client) {
      throw new Error("SOAP client not initialized");
    }

    if (!this.authHeader) {
      throw new Error(
        "Authentication header not set. Call setAuthenticationHeader() first."
      );
    }

    const requestArgs = this.buildSoapRequest(statement);

    return new Promise((resolve, reject) => {
      (this.client as any).PassThroughReq(
        requestArgs,
        (err: any, result: any) => {
          if (!err) {
            try {
              const response = this.parser.parse(result.PassThroughReqResult);
              const formattedResponse =
                response["PickResponse"]["Files"]["File"];

              // Check for various error conditions in the response
              if (formattedResponse?.Item?.a1?.includes("0 record(s)")) {
                reject(new Error("No records found in SOAP response"));
              } else if (
                formattedResponse?.Item?.a1?.includes("syntax error")
              ) {
                console.log("formattedResponse", formattedResponse);
                reject(new Error("Error querying SOAP due to syntax"));
              } else if (formattedResponse?.Item?.a1?.includes("Bad data")) {
                console.log("formattedResponse", formattedResponse);
                reject(new Error("Error querying SOAP due to bad data"));
              } else {
                resolve(formattedResponse);
              }
            } catch (error) {
              console.error("Error parsing SOAP response:", error);
              reject(new Error("Error parsing SOAP response"));
            }
          } else {
            console.error(`Error calling SOAP service: ${err}`);
            reject(new Error("Error calling SOAP service"));
          }
        }
      );
    });
  }

  /**
   * Get all available SOAP methods from the WSDL
   * @returns Array of method names
   */
  public getAvailableMethods(): string[] {
    const description = this.describe();
    const methods: string[] = [];

    // Navigate through the WSDL structure to extract method names
    Object.values(description).forEach((service: any) => {
      Object.values(service).forEach((port: any) => {
        if (port && typeof port === "object") {
          methods.push(...Object.keys(port));
        }
      });
    });

    return methods;
  }

  /**
   * Make a SOAP method call (generic method, use callPassThroughReq for Sagitta queries)
   * @param methodName The SOAP method to call
   * @param args Arguments for the method
   * @returns Promise resolving to the SOAP response
   */
  public async callMethod(methodName: string, args: any = {}): Promise<any> {
    if (!this.client) {
      throw new Error("SOAP client not initialized");
    }

    try {
      // Get the method from the client
      const method = (this.client as any)[methodName];
      if (typeof method !== "function") {
        throw new Error(
          `Method '${methodName}' not found. Available methods: ${this.getAvailableMethods().join(
            ", "
          )}`
        );
      }

      console.log(method.toString());

      // Call the method
      const result = await new Promise((resolve, reject) => {
        method.call(this.client, args, (err: any, result: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });

      return result;
    } catch (error) {
      console.error(`Error calling SOAP method '${methodName}':`, error);
      throw error;
    }
  }

  /**
   * Get method signature/parameters for a specific method
   * @param methodName The method name to inspect
   * @returns Method signature information
   */
  public getMethodSignature(methodName: string): any {
    const description = this.describe();

    // Navigate through the WSDL structure to find the specific method
    for (const [serviceName, service] of Object.entries(description)) {
      for (const [portName, port] of Object.entries(service as any)) {
        if (port && typeof port === "object" && (port as any)[methodName]) {
          return {
            serviceName,
            portName,
            methodName,
            signature: (port as any)[methodName],
          };
        }
      }
    }

    return null;
  }

  /**
   * Helper method to check if data should be treated as array
   * @param data Response data
   * @param arrayAllowed Whether arrays are allowed
   * @param arrayForced Whether to force single items into arrays
   * @returns Processed data
   */
  private arrayCheck({
    arrayAllowed,
    arrayForced,
    data,
  }: {
    data: any;
    arrayForced?: boolean;
    arrayAllowed: boolean;
  }): any | any[] {
    switch (true) {
      case !Array.isArray(data) && arrayForced:
        return [data.Item];
      case Array.isArray(data) && !arrayAllowed:
        throw new Error("Array not allowed");
      case Array.isArray(data):
        return data.map((item: any) => item.Item);
      default:
        return data.Item;
    }
  }

  public async getPolicies(args: {
    policyNumber?: string;
    clientCd?: string;
    coverageCd?: string;
    departmentCd?: string;
    effectiveDate?: Date;
    expirationDate?: Date;
  }): Promise<Partial<PoliciesSchema>[]> {
    const criteria = this.buildCriteria(args);
    const statement = `SELECT POLICIES *CRITERIA* WITH ${criteria}`;
    const result = await this.callPassThroughReq<SoapPoliciesSchema>(statement);
    return this.transformSoapPoliciesToSQLPolicies(result);
  }

  private buildCriteria(args: {
    policyNumber?: string;
    clientCd?: string;
    coverageCd?: string;
    departmentCd?: string;
    effectiveDate?: Date;
    expirationDate?: Date;
  }): string {
    const criteria: string[] = [];
    if (args.policyNumber) {
      criteria.push(`POLICY.NUMBER=${args.policyNumber}`);
    }
    if (args.clientCd) {
      criteria.push(`CLIENTS.ID=${args.clientCd}`);
    }
    if (args.coverageCd) {
      criteria.push(`COVCODE=${args.coverageCd}`);
    }
    if (args.departmentCd) {
      criteria.push(`DEPARTMENT_CODE=${args.departmentCd}`);
    }
    if (args.effectiveDate) {
      criteria.push(`EFFDATE=${args.effectiveDate}`);
    }
    if (args.expirationDate) {
      criteria.push(`EXPDATE=${args.expirationDate}`);
    }
    return criteria.join(" AND ");
  }

  transformSoapPoliciesToSQLPolicies(
    soapPolicies: SoapPoliciesSchema | SoapPoliciesSchema[]
  ): Partial<PoliciesSchema>[] {
    if (Array.isArray(soapPolicies)) {
      return soapPolicies.map((soapPolicy): PoliciesSchema => {
        return {
          POLICIES_ID: soapPolicy["@_sagitem"],
          CLIENTS_ID: soapPolicy.ClientCd,
          COVCODE: getCoverageCodeById(soapPolicy.CoverageCd).coverageCode,
          POLICYNUMBER: soapPolicy.PolicyNumber,
          DEPARTMENT_CODE: soapPolicy?.DepartmentCd?.toString(),
          EXPDATE: oaDateToJsDate(soapPolicy.ExpirationDate),
          EFFDATE: oaDateToJsDate(soapPolicy.EffectiveDate),
        };
      });
    } else {
      return [
        {
          POLICIES_ID: soapPolicies["@_sagitem"],
          CLIENTS_ID: soapPolicies.ClientCd,
          COVCODE: getCoverageCodeById(soapPolicies.CoverageCd).coverageCode,
          POLICYNUMBER: soapPolicies.PolicyNumber,
          DEPARTMENT_CODE: soapPolicies?.DepartmentCd?.toString(),
          EXPDATE: oaDateToJsDate(soapPolicies.ExpirationDate),
          EFFDATE: oaDateToJsDate(soapPolicies.EffectiveDate),
        },
      ];
    }
  }
}

// Example usage (commented out to prevent immediate execution)
async function main() {
  try {
    // 1. Create client with authentication
    const client = await SagittaSoapClient.create(undefined, authHeader);
    const result = await client.getPolicies({
      policyNumber: "0000946359",
    });
    // 2. Example PassThroughReq call with proper authentication
    console.log("SOAP Result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
