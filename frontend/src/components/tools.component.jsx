import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/marker";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";

import { uploadImage } from "../common/firebase";

const uploadImageByFile = (e) => {
  return uploadImage(e).then((url) => {
    if (url) {
      return {
        success: 1,
        file: { url },
      };
    }
  });
};

const uploadImageByURL = (e) => {
  return new Promise((resolve, reject) => {
    try {
      const imageUrl = e;
      resolve(imageUrl);
    } catch (err) {
      reject(err);
    }
  }).then((url) => {
    return {
      success: 1,
      file: { url },
    };
  });
  // .catch((error) => {
  //   return {
  //     success: 0,
  //     error: { message: error.message },
  //   };
  // });
};

export const tools = {
  embed: Embed,
  list: {
    class: List,
    inlineToolbar: true,
  },
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByUrl: uploadImageByURL,
        uploadByFile: uploadImageByFile,
      },
    },
  },
  header: {
    class: Header,
    config: {
      placeholder: "Enter a header",
      levels: [2, 3],
      defaultLevel: 2,
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
  marker: Marker,
  inlineCode: InlineCode,
};
