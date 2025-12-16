import { Metadata } from "next";
import Recettes from "./content";
 
export const metadata: Metadata = {
  title: "Recettes",
};
 
export default function RecettePage() {
  return <Recettes />;
}