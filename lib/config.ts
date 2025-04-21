const config = {
  env: {
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    },
    remita: {
      publicKey: process.env.NEXT_PUBLIC_REMITA_KEY || '',
      sdkUrl: process.env.NEXT_PUBLIC_REMITA_SDK_URL || '',
      serviceTypeId: process.env.NEXT_PUBLIC_REMITA_SERVICE_TYPE_ID || '',
    },
  },
};

export default config;

console.log('Remita Service Type ID:', config.env.remita.serviceTypeId);
