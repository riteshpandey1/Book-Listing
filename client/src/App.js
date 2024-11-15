import React from "react";
import BookList from "./component/BookList";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 text-center text-2xl font-bold">
        Book Listing Application
      </header>
      <main className="p-4">
        <BookList />
      </main>
    </div>
  );
}

export default App;
