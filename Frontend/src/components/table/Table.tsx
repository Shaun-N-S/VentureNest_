import type React from "react";
import { AnimatePresence, motion } from "framer-motion";

interface header<data> {
    id: string;
    label: string;
    render: (row: data) => React.ReactNode;
}

interface propType<data> {
    headers: header<data>[];
    data: data[];
}

const rowVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: (i: number) => ({
        opacity: 1,
        height: "auto",
        transition: { delay: i * 0.1, duration: 0.35 },
    }),
    exit: { opacity: 0, height: 0, transition: { duration: 0.25 } },
};

function Table<T extends { id?: string | number }>({ headers, data }: propType<T>) {
    return (
        <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm hide-scroll-bar">
            <table className="w-full border-collapse text-sm text-left table-fixed ">
                <thead className="bg-gray-50 text-gray-600 text-[13px] font-semibold uppercase tracking-wider border-b border-gray-200">
                    <tr>
                        {headers.map((header) => (
                            <th
                                key={header.id}
                                className="px-6 py-3 text-left whitespace-nowrap select-none"
                            >
                                {header.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 ">
                    <AnimatePresence mode="wait">
                        {data.length > 0 ? (
                            data.map((row, index) => (
                                <motion.tr
                                    key={row.id ?? index} // unique key per row
                                    custom={index}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    variants={rowVariants}
                                    className="hover:bg-gray-50 transition-colors duration-150"
                                >
                                    {headers.map((header) => (
                                        <td
                                            key={header.id}
                                            className="px-6 py-4 text-gray-800 whitespace-nowrap"
                                        >
                                            {header.render(row)}
                                        </td>
                                    ))}
                                </motion.tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={headers.length}
                                    className="text-center text-gray-500 py-8"
                                >
                                    No data available
                                </td>
                            </tr>
                        )}
                    </AnimatePresence>
                </tbody>
            </table>
        </div>
    );
}

export default Table;
