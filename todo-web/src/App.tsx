import { useState } from "react";
import "./App.css";
import AddButton from "./components/filter/AddButton/AddButton";
import DropDownMenu from "./components/filter/DropDownMenu/DropDownMenu";

function App() {
  const [reloadToken, setReloadToken] = useState(0);

  return (
    <main className="category-controls">
      <DropDownMenu reloadToken={reloadToken} />
      <AddButton onCategoryAdded={() => setReloadToken((current) => current + 1)} />
    </main>
  );
}

export default App;
