import { Link } from "@remix-run/react";

type ActionData = {
  errors?: {
    title?: string;
    body?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get("file_input");

  // if (typeof file !== "string" || title.length === 0) {
  //   return json<ActionData>(
  //     { errors: { title: "Title is required" } },
  //     { status: 400 }
  //   );
  // }


  // const note = await createNote({ title, body, userId });
  return;

  // return redirect(`/notes/${note.id}`);
};

export default function MealsIndexPage() {
  return (
    <div className="p-10">
      <h1 className="text-2xl">Meal AI</h1>
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" for="file_input">Upload an image of a dish, and we'll tell you what it is!</label>
      <input className="block w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer text-md bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" name="file_input" type="file"></input>
    </div>
  );
}
