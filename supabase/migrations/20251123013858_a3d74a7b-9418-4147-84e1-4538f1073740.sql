-- Update the handle_new_user function to check for manager staff ID
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_role app_role;
BEGIN
  -- Determine role based on staff_id
  IF NEW.raw_user_meta_data->>'staff_id' = '12345678' THEN
    user_role := 'manager';
  ELSE
    user_role := 'customer';
  END IF;

  INSERT INTO public.profiles (id, email, full_name, staff_id)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'staff_id'
  );
  
  -- Assign role based on staff_id
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);
  
  RETURN NEW;
END;
$function$;