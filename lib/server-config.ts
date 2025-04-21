interface ServerConfig {
  remita: {
    merchantId: string;
    serviceTypeId: string;
    apiKey?: string;
  };
}

export const serverConfig: ServerConfig = {
  remita: {
    merchantId: process.env.REMITA_MERCHANT_ID || '',
    serviceTypeId: process.env.REMITA_SERVICE_TYPE_ID || '',
    apiKey: process.env.REMITA_API_KEY || '',
  },
};
