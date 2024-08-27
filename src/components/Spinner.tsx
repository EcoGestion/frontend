const Spinner = () => {
    return (
    <div className="flex items-center justify-center h-screen w-full">
        <div className="spinner-border" style={{width: "60px", height: "60px"}} role="status">
            <span className="sr-only">Loading...</span>
        </div>
    </div>
    );
}

export default Spinner
