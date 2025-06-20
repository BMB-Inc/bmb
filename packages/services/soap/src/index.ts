import { createClientAsync, IOptions, Client as SoapClient } from "soap";

class SagittaSoapClient {
  private client: SoapClient | null = null;

  constructor(wsdl: string) {
    this.initClient(wsdl);
  }

  private async initClient(wsdl: string) {
    try {
      const wsdlUrl = process.env.SAGITTA_SOAP_WSDL_URL;
      if (!wsdlUrl) {
        throw new Error(
          "SAGITTA_WSDL_URL is not set. Check your environment variables."
        );
      }

      this.client = await createClientAsync(wsdlUrl, {
        wsdl_headers: {
          SOAPAction:
            "https://ws14.sagitta-online.com/sagittaws/transporter.asmx?op=PassThroughReq",
        },
      });
    } catch (error) {
      console.error(error);
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
    console.log("WSDL Structure:", JSON.stringify(description, null, 2));
    return description;
  }
}

export { SagittaSoapClient };
