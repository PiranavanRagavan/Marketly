-- Update the handle_new_user function to support multiple staff IDs
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_role app_role;
  provided_staff_id TEXT;
BEGIN
  provided_staff_id := NEW.raw_user_meta_data->>'staff_id';
  
  -- Determine role based on staff_id
  IF provided_staff_id = '12345678' THEN
    user_role := 'manager';
  ELSIF provided_staff_id = '12345' THEN
    user_role := 'staff';
  ELSE
    user_role := 'customer';
  END IF;

  INSERT INTO public.profiles (id, email, full_name, staff_id)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    provided_staff_id
  );
  
  -- Assign role based on staff_id
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);
  
  RETURN NEW;
END;
$function$;

-- Manually assign manager role to sufyanmk05@gmail.com if user exists
DO $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Find the user ID for sufyanmk05@gmail.com
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = 'sufyanmk05@gmail.com'
  LIMIT 1;

  -- If user exists, ensure they have manager role
  IF target_user_id IS NOT NULL THEN
    -- Remove existing roles for this user to avoid conflicts
    DELETE FROM public.user_roles WHERE user_id = target_user_id;
    
    -- Add manager role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'manager')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;