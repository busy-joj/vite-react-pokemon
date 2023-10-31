// import cx from "classnames";
import React, { useState } from 'react'

const LikeDislike = () => {
	const [liked, setLiked] = useState(100)
	const handleClickLike = (e) => {
		console.log(e)
		setLiked((prev) => prev + 1)
	}
	return (
		<>
			<div>
				<button
					className="like-button"
					onClick={(e) => handleClickLike(e)}>
					Like | <span className="likes-counter">{liked}</span>
				</button>
				<button>Dislike | 1</button>
			</div>
			<style>{`
                    .like-button, .dislike-button {
                        font-size: 1rem;
                        padding: 5px 10px;
                        color:   #585858;
                    }

                    .liked, .disliked {
                        font-weight: bold;
                        color: #1565c0;
                    }
                `}</style>
		</>
	)
}

export default LikeDislike
