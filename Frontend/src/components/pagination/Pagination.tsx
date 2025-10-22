import { Button } from "../../components/ui/button";
interface propType {
    currentPage: number;
    totalPages: number;
    setPage: (page: number) => void;
}

function Pagination({ totalPages, currentPage, setPage }: propType) {
    console.log("pagination console :::  ",totalPages, currentPage, setPage)
    return (
        <div className="flex items-center justify-center space-x-2 mt-6">
            <Button
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage <= 1}
            >
                previous
            </Button>
            {Array(totalPages)
                .fill(null)
                .map((_, i) => {
                    const isActive = i + 1 === currentPage;
                    return (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-4 py-2 rounded-lg border transition-colors duration-200 font-medium
            ${isActive
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-black border-gray-300 hover:bg-gray-100"
                                }`}
                        >
                            {i + 1}
                        </button>
                    );
                })}
            <Button
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage == totalPages}
            >
                next
            </Button>
        </div>
    );
}

export default Pagination;
