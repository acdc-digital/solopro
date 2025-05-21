import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { revalidatePath } from "next/cache";

export default async function ServerPage() {
  // Fetch numbers with authentication
  const data = await fetchQuery(
    api.myFunctions.listNumbers,
    { count: 10 },
    { token: await convexAuthNextjsToken() }
  );

  async function addNumber(formData: FormData) {
    "use server";

    // Call authenticated mutation
    await fetchMutation(
      api.myFunctions.addNumber,
      {
        value: parseInt(formData.get("value") as string) || Math.floor(Math.random() * 100),
      },
      { token: await convexAuthNextjsToken() }
    );
    
    // Revalidate this page to show the updated data
    revalidatePath("/server");
  }

  return (
    <div className="p-8 flex flex-col gap-8">
      <h1 className="text-4xl font-bold">Server-side Authentication Example</h1>
      
      <div className="border p-4 rounded-md bg-slate-50 dark:bg-slate-800">
        <h2 className="text-2xl font-bold mb-4">User Information</h2>
        <p>Logged in as: {data.viewer || "Unknown"}</p>
      </div>
      
      <div className="border p-4 rounded-md bg-slate-50 dark:bg-slate-800">
        <h2 className="text-2xl font-bold mb-4">Numbers</h2>
        <ul className="list-disc pl-5 mb-4">
          {data.numbers.map((number: number, index: number) => (
            <li key={index}>{number}</li>
          ))}
        </ul>
        
        <form action={addNumber} className="flex flex-row gap-2">
          <input
            type="number"
            name="value"
            placeholder="Enter a number"
            className="px-2 py-1 border rounded-md"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-1 rounded-md"
          >
            Add Number
          </button>
        </form>
      </div>
    </div>
  );
}
