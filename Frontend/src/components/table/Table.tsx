import type React from "react";
import { AnimatePresence, motion } from "framer-motion";

interface header<data> {
    id: string;
    label: string;
    render: (row: data) => React.ReactNode;
    responsive?: boolean; // Hide on mobile by default
}

interface propType<data> {
    headers: header<data>[];
    data: data[];
    primaryField?: string; // Field to highlight as primary on mobile
}

const rowVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: (i: number) => ({
        opacity: 1,
        height: "auto",
        transition: { delay: i * 0.1, duration: 0.35 },
    }),
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.35 },
    }),
};

const fieldVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { delay: i * 0.05, duration: 0.25 },
    }),
};

function Table<T extends { id?: string | number }>({
    headers,
    data,
    primaryField,
}: propType<T>) {
    // Filter responsive headers (headers without responsive: false)
    const desktopHeaders = headers.filter((h) => h.responsive !== false);
    const mobileHeaders = headers;

    return (
        <>
            {/* Desktop Table View - lg and above */}
            <div className="hidden lg:block w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm hide-scroll-bar">
                <table className="w-full border-collapse text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 text-[13px] font-semibold uppercase tracking-wider border-b border-gray-200 sticky top-0 z-10">
                        <tr>
                            {desktopHeaders.map((header) => (
                                <th
                                    key={header.id}
                                    className="px-6 py-3 text-left whitespace-nowrap select-none"
                                >
                                    {header.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        <AnimatePresence mode="wait">
                            {data.length > 0 ? (
                                data.map((row, index) => (
                                    <motion.tr
                                        key={row.id ?? index}
                                        custom={index}
                                        initial="hidden"
                                        animate="visible"
                                        variants={rowVariants}
                                        className="hover:bg-gray-50 transition-colors duration-150"
                                    >
                                        {desktopHeaders.map((header) => (
                                            <td
                                                key={header.id}
                                                className="px-6 py-4 text-gray-800"
                                            >
                                                {header.render(row)}
                                            </td>
                                        ))}
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={desktopHeaders.length}
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

            {/* Tablet View - md to lg (2 columns) */}
            <div className="hidden md:grid lg:hidden grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <AnimatePresence mode="wait">
                    {data.length > 0 ? (
                        data.map((row, index) => (
                            <motion.div
                                key={row.id ?? index}
                                custom={index}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={cardVariants}
                                className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow duration-150"
                            >
                                {mobileHeaders.map((header, fieldIndex) => (
                                    <motion.div
                                        key={header.id}
                                        custom={fieldIndex}
                                        initial="hidden"
                                        animate="visible"
                                        variants={fieldVariants}
                                        className="flex flex-col mb-3 last:mb-0"
                                    >
                                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                                            {header.label}
                                        </span>
                                        <div className="text-sm text-gray-800">
                                            {header.render(row)}
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-2 text-center text-gray-500 py-8">
                            No data available
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Mobile Card View - sm and below (single column) */}
            <div className="md:hidden space-y-3 w-full px-1">
                <AnimatePresence mode="wait">
                    {data.length > 0 ? (
                        data.map((row, index) => (
                            <motion.div
                                key={row.id ?? index}
                                custom={index}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={cardVariants}
                                className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow duration-150 divide-y divide-gray-100"
                            >
                                {mobileHeaders.map((header, fieldIndex) => (
                                    <motion.div
                                        key={header.id}
                                        custom={fieldIndex}
                                        initial="hidden"
                                        animate="visible"
                                        variants={fieldVariants}
                                        className={`py-3 first:pt-0 last:pb-0 ${header.id === primaryField ? "pb-3 border-b" : ""
                                            }`}
                                    >
                                        <span
                                            className={`text-xs font-semibold uppercase tracking-wider mb-1.5 block ${header.id === primaryField
                                                    ? "text-indigo-600"
                                                    : "text-gray-600"
                                                }`}
                                        >
                                            {header.label}
                                        </span>
                                        <div
                                            className={`${header.id === primaryField
                                                    ? "text-base font-semibold text-gray-900"
                                                    : "text-sm text-gray-700"
                                                }`}
                                        >
                                            {header.render(row)}
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-8 bg-white rounded-lg border border-gray-200">
                            No data available
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}

export default Table;