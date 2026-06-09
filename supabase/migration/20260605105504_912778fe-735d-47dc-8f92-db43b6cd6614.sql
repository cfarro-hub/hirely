
REVOKE EXECUTE ON FUNCTION public.consume_cv_credit(TEXT) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.refund_cv_credit() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.create_referral(TEXT) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
