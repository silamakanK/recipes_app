"use client";
 
import { ask } from "@/actions/recipe";
import { FormEvent, useState } from "react";
 
export default function Recettes() {
  const [demandeResponse, setDemandeResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
 
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
 
    setIsLoading(true);
 
    const form = new FormData(e.currentTarget);
    const answer = await ask(form);
 
    if (!answer) {
      setDemandeResponse("Une erreur est survenue");
    } else {
      setDemandeResponse(answer);
    }
 
    setIsLoading(false);
  };
  return (
    <>
      <h1>Quelle notion souhaites tu comprendre ?</h1>
      <form action="" onSubmit={handleSubmit}>
        <label htmlFor="demande">Notion :</label>
        <input
          type="text"
          name="notion"
          id="demande"
          placeholder="Intelligence Artificielle"
          disabled={isLoading}
        />
        <br />
        <input type="submit" value="Demander" disabled={isLoading} />
      </form>
      {demandeResponse && <p>{demandeResponse}</p>}
    </>
  );
}