import React from "react";

const PopularRecipes = () => {
  return (
    <section className="flex flex-col gap-5 px-4 py-2">
      <header>
        <h2>Trending Recipes </h2>
        <small>Popular recipes to help you plan your next meals.</small>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        [popular recipes will go here]
      </section>
      <div className="col-span-4 flex justify-center">
        <button className="btn btn-secondary w-full md:w-1/3">more</button>
      </div>
    </section>
  );
};

export default PopularRecipes;
