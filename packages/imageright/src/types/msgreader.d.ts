declare module 'msgreader' {
  interface Recipient {
    name?: string;
    email?: string;
  }

  interface Attachment {
    fileName?: string;
    name?: string;
    contentLength?: number;
    content?: Uint8Array;
  }

  interface MsgFileData {
    subject?: string;
    senderName?: string;
    senderEmail?: string;
    body?: string;
    bodyHTML?: string;
    recipients?: Recipient[];
    attachments?: Attachment[];
    messageDeliveryTime?: string;
    creationTime?: string;
    lastModificationTime?: string;
  }

  class MsgReader {
    constructor(data: ArrayBuffer);
    getFileData(): MsgFileData;
    getAttachment(index: number): Attachment | null;
  }

  export default MsgReader;
}

