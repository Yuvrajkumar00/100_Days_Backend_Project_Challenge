const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(asyncHandler(req, res))
        .catch((error) => next(error));
    }
}

export {asyncHandler};