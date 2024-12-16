const Skeleton = () => {
    <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
        <div className="flex w-52 flex-col gap-4">
            <div className="du-skeleton h-32 w-full"></div>
            <div className="du-skeleton h-4 w-28"></div>
            <div className="du-skeleton h-4 w-full"></div>
            <div className="du-skeleton h-4 w-full"></div>
        </div>
    </div>;
}

export default Skeleton
