import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';

export const noImage = '/assets/images/no_image.png';

export const getImage = async (imageName, imagepath, imagurl = process.env.VUE_APP_AWS_S3_IMAGE) => {
  let file;

  let checkImage = imageName;
  if (checkImage === null || checkImage.split('.')[0] === 'null') return noImage;

  try {
    // retrive the file if its in cache already
    file = await readFile(imageName);
  } catch (e) {
    // trying to create a dir
    await createDir();
    // write file into cache
    if (await cacheImage(imageName, imagepath, imagurl)) {
      file = await readFile(imageName);
    }
  }

  return file ? file.data : noImage;
};

//read the file from cache and return file content
const readFile = async (imageName) => {
  return await Filesystem.readFile({
    path: `cache-image/${imageName}`,
    directory: Directory.Cache,
    encoding: Encoding.UTF8
  });
};

const createDir = async () => {
  try {
    await Filesystem.mkdir({
      path: 'cache-image',
      directory: Directory.Cache
    });
  } catch (e) {
    // Folder already exist or cannot create
  }
};

const cacheImage = async (imageName, imagePath, imagurl) => {
  try {
    const path = `${imagurl}/${imagePath}/${imageName}`;
    const response = await fetch(path, {
      method: 'GET'
    });

    if (response.status === 200) {
      // convert to a Blob
      const blob = await response.blob();
      //convert to base64 data, which the Filesystem plugin requires
      const base64Data = await convertBlobToBase64(blob);

      //write file into cache folder
      return await Filesystem.writeFile({
        path: `cache-image/${imageName}`,
        data: base64Data,
        directory: Directory.Cache,
        encoding: Encoding.UTF8
      });
    } else {
      return null;
    }
  } catch (e) {
    //if image cannot write into cache return null to show default image
    return null;
  }
};

// helper function
const convertBlobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
};
