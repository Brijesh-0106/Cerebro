import { useState } from "react";
import CreatableSelect from "react-select/creatable";
import type { Option } from "../Models/CardProps";

export default function MultiTagSelect(props: any) {
  const styles = {
    multiValue: (base: any, { data }: any) => ({
      ...base,
      backgroundColor: data.color,
      borderRadius: "6px",
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: "#fff",
      fontWeight: 500,
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: "#fff",
      ":hover": {
        backgroundColor: "rgba(0,0,0,0.2)",
        color: "#fff",
      },
    }),
  };

  function getRandomColor() {
    const colors = [
      "#EF4444", // red
      "#F97316", // orange
      "#FACC15", // yellow
      "#22C55E", // green
      "#3B82F6", // blue
      "#8B5CF6", // violet
      "#EC4899", // pink
    ];

    return colors[Math.floor(Math.random() * colors.length)];
  }

  const initialOptions: Option[] = [
    { label: "Bug", value: "bug", color: getRandomColor() },
    { label: "Feature request", value: "feature", color: getRandomColor() },
    { label: "Polish", value: "polish", color: getRandomColor() },
    { label: "Build", value: "build", color: getRandomColor() },
  ];
  const [options, setOptions] = useState<Option[]>(initialOptions);
  const [value, setValue] = useState<Option[]>([]);

  return (
    <CreatableSelect
      isMulti
      options={options}
      styles={styles}
      className="w-full"
      value={value}
      onChange={(newValue) => {
        setValue(newValue as Option[]);
        props.setTagsList(newValue as Option[]);
      }}
      onCreateOption={(inputValue) => {
        const newOption = {
          label: inputValue,
          value: inputValue.toLowerCase().replace(/\s+/g, "-"),
          color: getRandomColor(),
        };

        setOptions((prev) => [...prev, newOption]);
        setValue((prev) => [...prev, newOption]);
      }}
      placeholder="Select or create tags..."
    />
  );
}
