import jwt from "jsonwebtoken";

export default function decodeToken(token) {
    if (!token) return null;

    try {
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);

        return userId;
    } catch {
        return null;
    }
}