import { useEffect, useState } from 'react';
import type {
  ActionFunction } from '@remix-run/node';
import escapeHtml from "escape-html";
import {
  json,
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
} from '@remix-run/node';
import { Form, useActionData } from "@remix-run/react";
import fs from 'fs';

const supportedImageMimeType = /image\/(png|jpg|jpeg)/i;

export const action: ActionFunction = async ({ request }) => {
  console.log(request);
  // TODO: Check filename size is not > 1MB
  // Uploads file to the server
  const fileUploadHandler = unstable_createFileUploadHandler({
    directory: './public/uploads',
    file: ({ filename }) => filename,
  });

  const formData: any = await unstable_parseMultipartFormData(request, fileUploadHandler);
  const filename = formData.get('file_input');
  if (filename) {
    const uploadFile = new FormData();
    uploadFile.append('file', filename);
    console.log(uploadFile);
    // let fileData;
    // fs.readFile('/Users/minesh/Dev/Personal/aiengine/server/public/uploads/Air-Jordan-4-Retro-Red-Thunder-Black-Red-New-Releases-CT8527-016_720x-1658497428942.jpg', function (err, data) {
    //   if (err) throw err;
    //   fileData = data;
    // });
    // console.log(new Blob(filename));
    let apiUrl = "http://api.logmeal.es/v2/recognition/dish";
    let res = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      method: 'POST',
      body: uploadFile
    });
  
    let data = await res.json();
    console.log(data);
  }


  // let prunedData = data.map((record) => {
  //   return {
  //     id: record.id,
  //     title: record.title,
  //     formattedBody: escapeHtml(record.content),
  //   };
  // });
  // const prunedLogmealResponse = json(prunedData);
  
  return { filename };
};

function successNotification(message: String) {
  return (
  <div className="w-full mx-auto">
      <div className="flex p-5 rounded-lg shadow bg-emerald-100">
      <div>
        <svg className="w-6 h-6 fill-current text-emerald-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z"/></svg>
      </div>
      <div className="ml-3">
        <h2 className="font-semibold text-emerald-800">{message}</h2>
      </div>
      </div>
    </div>
  );
}

function noImageUploaded() {
  return (
    <div className="flex flex-col items-center bg-white border rounded-lg shadow-md md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
       <div className="flex items-center justify-center w-64 font-bold min-h-100" id="imagePreview">
        <span className="p-2 text-teal-200">Image Preview</span>
       <img className="hidden object-cover w-full text-teal-200 rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg" src="" alt="Dish Preview" />
       </div>
       <div className="flex flex-col justify-between p-4 leading-normal">
           <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Margherita PIzza</h5>
           <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Enjoy your slice of heaven.</p>
       </div>
     </div>
  )
}

function imageUploaded(fileDataURL: string) {
  return (
    <div className="flex flex-col items-center max-w-xl bg-white border rounded-lg shadow-md md:flex-row hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
       <div className="flex items-center justify-center w-64 font-bold min-h-100" id="imagePreview">
        <img className="block object-cover w-full text-teal-200 rounded-t-lg h-96 md:h-auto md:w-64 md:rounded-none md:rounded-l-lg" src={fileDataURL} alt="Dish Preview" />
       </div>
       <div className="flex flex-col justify-between p-4 leading-normal">
           <h5 className="items-center justify-center mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Margherita PIzza</h5>
           <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Enjoy your slice of heaven.</p>
       </div>
     </div>
  )
}

function results() {
  return (
    <div className="flex flex-col items-center bg-white border rounded-lg shadow-md md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
    <img className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg" src="./public/uploads/pizza.jpg" alt="" />
    <div className="flex flex-col justify-between p-4 leading-normal">
        <h5 className="items-center justify-center mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Margherita PIzza</h5>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Enjoy your slice of heaven.</p>
    </div>
  </div>
  );
}

export default function MealsIndexPage() {
  const [file, setFile] = useState(null);
  const [fileDataURL, setFileDataURL] = useState(null);
  const actionData = useActionData();
  
  const onChangeHandler = (event: React.SyntheticEvent<EventTarget>) => {
    const file = (event.target as HTMLFormElement).files[0];
    if (!file.type.match(supportedImageMimeType)) {
      alert("Image mime type is not valid");
      return;
    }
    setFile(file);
  };

  /*
    Handles image preview
  */
  useEffect(() => {
    let fileReader: any;
    let isCancel = false;
    if (file) {
      fileReader = new FileReader();
      fileReader.onload = (e: any) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setFileDataURL(result)
        }
      }
      fileReader.readAsDataURL(file);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    }

  }, [file]);

  return (
    <div className="p-10">
      <h1 className="px-2 text-2xl">Meal AI</h1>
      <Form method="post" encType="multipart/form-data" className="px-8 pt-6 pb-8 mb-4 bg-white rounded shadow-md">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="file_input">Upload an image of a dish, and we'll tell you what it is!</label>
        <input className="block w-full text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="file_input" name="file_input" type="file" onChange={onChangeHandler}></input>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">PNG, JPG or GIF (MAX. 800x400px).</p>
        <button className="block px-4 py-2 my-2 font-bold text-white bg-teal-500 rounded first-letter:my-4 hover:bg-teal-700" type="submit">Upload</button>
      </Form>
      { actionData && actionData.filename &&
        successNotification('Successfully uploaded file!')
      }
      {/* { fileDataURL
        ? imageUploaded(fileDataURL)
        : noImageUploaded()
      } */}
     </div>
  );
}
