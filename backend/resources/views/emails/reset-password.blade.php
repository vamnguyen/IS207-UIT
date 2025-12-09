<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .button { display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; }
        .footer { margin-top: 30px; font-size: 12px; color: #999; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Xin chào {{ $user->name }},</h2>

        <p>Bạn nhận được email này vì chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>

        <p style="text-align: center; margin: 30px 0;">
            <a href="{!! $url !!}" class="button" style="color: white;">Đặt lại mật khẩu</a>
        </p>

        <p>Liên kết đặt lại mật khẩu này sẽ hết hạn sau 60 phút.</p>

        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>

        <p>Trân trọng,<br>{{ config('app.name') }}</p>

        <div class="footer">
            <p>Nếu bạn gặp sự cố khi nhấp vào nút "Đặt lại mật khẩu", hãy sao chép và dán URL bên dưới vào trình duyệt web của bạn:</p>
            <p><a href="{!! $url !!}">{!! $url !!}</a></p>
        </div>
    </div>
</body>
</html>
