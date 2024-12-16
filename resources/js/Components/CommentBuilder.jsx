import { format } from 'date-fns';

const CommentBuilder = ({ author, createdAt, comment }) => {
    const formattedDate = format(new Date(createdAt), "p MMMM dd, yyyy"); // e.g., "4:00 PM October 29, 2024"

    return (
        <div role="alert" className="du-alert shadow-md w-screen mb-3 mr-5">
            <div>
                <h3 className="font-semibold text-base inline">{author}</h3>
                <h3 className="font-light text-xs inline ml-5">{formattedDate}</h3>
                <div className="text-xl mt-3">{comment}</div>
            </div>
        </div>
    );
};

export default CommentBuilder;
