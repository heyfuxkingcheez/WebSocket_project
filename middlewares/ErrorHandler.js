import { validationResult } from "express-validator";
const ErrorHandler = (err, req, res, next) => {
    console.log("Middleware Error Handling");
    console.log(err);
    console.log("=====> 잘못됌");

    // 토큰 유효성 검사
    if (err.name === "TokenTypeUnMatch") {
        return res.status(401).json({
            success: false,
            errorMessage: "토큰 타입이 일치하지 않습니다.",
        });
    }
    // 토큰이 만료 되었을 때
    if (err.name === "TokenExpiredError") {
        res.clearCookie("authorization");
        return res.status(401).json({
            success: false,
            errorMessage: "인증이 만료되었습니다. 재인증을 받아주세요.",
        });
    }
    // 토큰 사용자가 존재하지 않을 때
    if (err.name === "UserNotExistError") {
        res.clearCookie("authorization");
        return res.status(401).json({
            success: false,
            errorMessage: "토큰 사용자가 존재하지 않습니다.",
        });
    }
    // 토큰 발급을 받지 않았을 때
    if (err.name === "TokenNotExistError") {
        return res.status(401).json({
            success: false,
            errorMessage: "로그인 후 이용 가능합니다.",
        });
    }

    // Validation Error handling
    if (err.name === "ValidError") {
        console.log("=====> 회원가입 벨리데이션");
        const errors = validationResult(req);
        const path = errors.array()[0].path;
        if (path === "email") {
            return res.status(400).json({
                success: false,
                errorMessage: "이메일 형식이 올바르지 않습니다.",
            });
        }
        if (path === "nickName") {
            return res.status(400).json({
                success: false,
                errorMessage: "닉네임은 3자리 이상 필요합니다.",
            });
        }
        if (path === "password") {
            return res.status(400).json({
                success: false,
                errorMessage: "비밀번호는 5자리 이상 필요합니다.",
            });
        }
        if (path === "passwordConfirm") {
            return res.status(400).json({
                success: false,
                errorMessage: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
            });
        }
        // }
        return res.status(500).json({
            success: false,
            errorMessage:
                "예상치 못한 에러가 발생하였습니다. 관리자에게 문의 해주십시오.",
        });
    }

    // 회원정보 조회
    if (req.method === "GET") {
        res.status(500).json({
            success: false,
            errorMessage:
                "예상치 못한 에러가 발생하였습니다. 관리자에게 문의 해주십시오.",
        });
    }

    // 회원 탈퇴
    if (req.method === "DELETE") {
        if (err.name === "TokenNotExistError") {
            return res.status(401).json({
                success: false,
                errorMessage: "로그인 후 이용 가능합니다.",
            });
        }
    }

    // 로그아웃 API Error Handling
    if (req.route.path === "/logout") {
        return res.status(500).json({
            success: false,
            errorMessage:
                "예기치 못한 오류가 발생했습니다. 관리자에게 문의 하십시오.",
        });
    }
};

export { ErrorHandler };
