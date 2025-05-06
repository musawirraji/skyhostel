import { NextResponse } from 'next/server';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: 'https://ik.imagekit.io/02i1vgpvz',
});

export async function GET() {
  try {
    // Get the authentication parameters
    const authParams = imagekit.getAuthenticationParameters();

    // Return the authentication parameters
    return NextResponse.json(authParams);
  } catch (error) {
    console.error('Error generating ImageKit authentication:', error);
    return NextResponse.json(
      { error: 'Failed to generate authentication parameters' },
      { status: 500 }
    );
  }
}
