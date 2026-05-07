import { StatusCodes } from 'http-status-codes';

export const successResponse = (
    res,
    {
        data = null,
        message = 'Success',
        statusCode = StatusCodes.OK,
        meta = null
    } = {}
) => {

    const body = { success: true, message };

    if (data !== null) { body.data = data; }
    if (meta !== null) { body.meta = meta; }

    return res.status(statusCode).json(body);
};

export const errorResponse = (
    res,
    {
        message = 'Internal Server Error',
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
        errors = null
    } = {}
) => {

    const body = { success: false, message };
    if (errors !== null) { body.errors = errors; }

    return res.status(statusCode).json(body);
};