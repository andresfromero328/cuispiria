import React from "react";
import MacroPieChart from "./MacroPieChart";
import MealPlanningTable from "./MealPlanningTable";

interface Props {
  meals?: Array<number>;
}

const MealPlanning = ({ meals }: Props) => {
  return (
    <section className="flex flex-col gap-5 px-2">
      <header>
        <h2>Meals </h2>
        <small>An overview of everything you’re planning to eat today.</small>
      </header>

      {meals!.length > 0 ? (
        <>
          <MacroPieChart
            macros={{
              percentProtein: 21.5,
              percentCarbs: 14.4,
              percentFat: 64.1,
            }}
          />
          <MealPlanningTable />
        </>
      ) : (
        <p>There are no meals</p>
      )}
    </section>
  );
};

export default MealPlanning;
