import { upload } from '@imagekit/next';

const urlEndpoint = 'https://ik.imagekit.io/02i1vgpvz';
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '';

export const uploadToImageKit = async (file: File, fileName?: string) => {
  try {
    const customFileName =
      fileName || `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

    // Prepare folder path for organization
    const folder = '/passport_photos';

    // Get authentication parameters from our backend
    const authResponse = await fetch('/api/imagekit-auth');
    if (!authResponse.ok) {
      throw new Error('Failed to get ImageKit authentication');
    }

    const { signature, token, expire } = await authResponse.json();

    // Upload the file to ImageKit
    const response = await upload({
      file,
      fileName: customFileName,
      folder,
      useUniqueFileName: true,
      publicKey,
      signature,
      token,
      expire,
    });

    return {
      success: true,
      url: response.url,
      fileId: response.fileId,
      name: response.name,
      thumbnailUrl: response.thumbnailUrl,
    };
  } catch (error) {
    console.error('Error uploading to ImageKit:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Unknown error uploading file',
    };
  }
};

export default {
  urlEndpoint,
  uploadToImageKit,
};
