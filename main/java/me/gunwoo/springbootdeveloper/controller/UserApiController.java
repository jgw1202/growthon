package me.gunwoo.springbootdeveloper.controller;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import me.gunwoo.springbootdeveloper.dto.AddUserRequest;
import me.gunwoo.springbootdeveloper.service.UserService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@Controller
@RequestMapping("/user")
public class UserApiController {

    private final UserService userService;

    @PostMapping
    public String signUp(@RequestParam("email") String email, @RequestParam("password") String password) {

        // AddUserRequest 객체 대신 직접 UserService에 전달합니다.
        AddUserRequest request = new AddUserRequest();
        request.setEmail(email);
        request.setPassword(password);

        userService.save(request); // 회원가입 메소드 호출
        return "redirect:/login"; // 회원가입 완료 후 로그인 페이지로 이동
    }

    @GetMapping("/logout")
    public String logout(HttpServletRequest request , HttpServletResponse response) {
        new SecurityContextLogoutHandler().logout(request, response, SecurityContextHolder.getContext().getAuthentication());
        return "redirect:/login";
    }
}
