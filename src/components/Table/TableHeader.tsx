"use client";

const COLUMNS = [
  "User Name",
  "Email",
  "Status",
  "Added On",
  "Role",
] as const;

export function TableHeader() {
  return (
    <thead className="border-b border-[#DEE5EE]">
      <tr>
        {COLUMNS.map((label) => (
          <th
            key={label}
            className="px-6 py-3 text-start text-base font-medium text-[#2B303D]"
          >
            {label}
          </th>
        ))}
        <th className="px-6 py-3 text-start text-base font-medium text-[#2B303D]"></th>
      </tr>
    </thead>
  );
}
