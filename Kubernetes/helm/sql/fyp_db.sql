--
-- PostgreSQL database dump
--

\restrict Y72Qv2BxM9SK10Qe9IZCSF5obL6aFkc0qN6ldyauMaax5MbXjcWshv69v3jYoC3

-- Dumped from database version 17.10 (2947584)
-- Dumped by pg_dump version 17.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_logs (
    id bigint NOT NULL,
    user_id bigint,
    action text,
    logged_at timestamp without time zone DEFAULT now()
);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.audit_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: bookings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bookings (
    id bigint NOT NULL,
    child_id bigint NOT NULL,
    van_id bigint,
    status character varying(20) DEFAULT 'ACTIVE'::character varying,
    booked_at timestamp without time zone DEFAULT now(),
    CONSTRAINT bookings_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'CANCELLED'::character varying, 'COMPLETED'::character varying])::text[])))
);


--
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bookings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- Name: cash_payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cash_payments (
    id bigint NOT NULL,
    booking_id bigint NOT NULL,
    parent_id bigint,
    amount numeric(10,2) NOT NULL,
    payment_status character varying(20) DEFAULT 'PENDING'::character varying,
    proof_photo text,
    due_date date,
    payment_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT cash_payments_payment_status_check CHECK (((payment_status)::text = ANY ((ARRAY['PENDING'::character varying, 'PAID'::character varying, 'FAILED'::character varying])::text[])))
);


--
-- Name: cash_payments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cash_payments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cash_payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cash_payments_id_seq OWNED BY public.cash_payments.id;


--
-- Name: child_leaves; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.child_leaves (
    id bigint NOT NULL,
    child_id bigint,
    reason text,
    created_at timestamp without time zone DEFAULT now(),
    leave_days integer,
    leave_date date,
    return_date date,
    is_active boolean DEFAULT true
);


--
-- Name: child_leaves_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.child_leaves_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: child_leaves_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.child_leaves_id_seq OWNED BY public.child_leaves.id;


--
-- Name: child_pickups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.child_pickups (
    id bigint NOT NULL,
    child_id bigint,
    van_id bigint,
    driver_id bigint,
    pickup_time timestamp without time zone DEFAULT now(),
    latitude numeric(10,7),
    longitude numeric(10,7),
    status character varying(15) DEFAULT 'PENDING'::character varying,
    CONSTRAINT child_pickups_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'PICKED_UP'::character varying])::text[])))
);


--
-- Name: child_pickups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.child_pickups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: child_pickups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.child_pickups_id_seq OWNED BY public.child_pickups.id;


--
-- Name: children; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.children (
    id bigint NOT NULL,
    parent_id bigint NOT NULL,
    branch_id bigint NOT NULL,
    full_name character varying(150) NOT NULL,
    gender character varying(10),
    date_of_birth date NOT NULL,
    requires_girls_only boolean DEFAULT false,
    pickup_address text,
    grade character varying(20),
    emergency_contact character varying(20),
    disease text,
    child_pic text,
    created_at timestamp without time zone DEFAULT now(),
    longitude double precision,
    latitude double precision,
    on_leave boolean DEFAULT false,
    CONSTRAINT children_gender_check CHECK (((gender)::text = ANY ((ARRAY['MALE'::character varying, 'FEMALE'::character varying])::text[])))
);


--
-- Name: children_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.children_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: children_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.children_id_seq OWNED BY public.children.id;


--
-- Name: complaints; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.complaints (
    id bigint NOT NULL,
    parent_id bigint,
    driver_id bigint,
    school_id bigint,
    description text NOT NULL,
    status character varying(20) DEFAULT 'OPEN'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    resolved_at timestamp without time zone,
    child_id bigint,
    CONSTRAINT complaints_status_check CHECK (((status)::text = ANY ((ARRAY['OPEN'::character varying, 'IN_PROGRESS'::character varying, 'RESOLVED'::character varying, 'REJECTED'::character varying])::text[])))
);


--
-- Name: complaints_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.complaints_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: complaints_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.complaints_id_seq OWNED BY public.complaints.id;


--
-- Name: delay_reports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.delay_reports (
    id bigint NOT NULL,
    van_id bigint,
    route_id bigint,
    driver_id bigint,
    status character varying(20) DEFAULT 'PENDING'::character varying,
    reason character varying(100),
    comments text,
    delay_minutes integer,
    location character varying(255),
    incident_date date,
    students_affected integer DEFAULT 0,
    reported_at timestamp without time zone DEFAULT now(),
    resolved_at timestamp without time zone
);


--
-- Name: delay_reports_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.delay_reports_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: delay_reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.delay_reports_id_seq OWNED BY public.delay_reports.id;


--
-- Name: driver_approvals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.driver_approvals (
    id bigint NOT NULL,
    driver_id bigint NOT NULL,
    branch_id bigint NOT NULL,
    status character varying(20) DEFAULT 'PENDING'::character varying,
    remarks text,
    approved_by bigint,
    approved_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT driver_approvals_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'APPROVED'::character varying, 'REJECTED'::character varying])::text[])))
);


--
-- Name: driver_approvals_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.driver_approvals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: driver_approvals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.driver_approvals_id_seq OWNED BY public.driver_approvals.id;


--
-- Name: driver_assign; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.driver_assign (
    id bigint NOT NULL,
    old_driver bigint,
    new_driver bigint,
    van_id bigint,
    reason text,
    assign_at timestamp without time zone DEFAULT now(),
    leave_days integer,
    leave_date date
);


--
-- Name: driver_assign_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.driver_assign_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: driver_assign_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.driver_assign_id_seq OWNED BY public.driver_assign.id;


--
-- Name: driver_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.driver_documents (
    id bigint NOT NULL,
    driver_id bigint NOT NULL,
    driver_license text,
    id_card text,
    vehicle_docs text,
    vehicle_photo text,
    number_plate text,
    is_verified boolean DEFAULT false,
    verified_by bigint,
    verified_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: driver_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.driver_documents_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: driver_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.driver_documents_id_seq OWNED BY public.driver_documents.id;


--
-- Name: driver_ratings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.driver_ratings (
    id bigint NOT NULL,
    driver_id bigint,
    parent_id bigint,
    child_id bigint,
    rating integer,
    comments text,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT driver_ratings_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


--
-- Name: driver_ratings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.driver_ratings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: driver_ratings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.driver_ratings_id_seq OWNED BY public.driver_ratings.id;


--
-- Name: guard_verifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.guard_verifications (
    id bigint NOT NULL,
    guard_id bigint NOT NULL,
    child_id bigint NOT NULL,
    van_id bigint,
    branch_id bigint NOT NULL,
    verification_type character varying(10) DEFAULT 'PENDING'::character varying,
    latitude numeric(10,7),
    longitude numeric(10,7),
    remarks text,
    verification_time timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT guard_verifications_verification_type_check CHECK (((verification_type)::text = ANY ((ARRAY['PENDING'::character varying, 'VERIFIED'::character varying, 'ABSENT'::character varying])::text[])))
);


--
-- Name: guard_verifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.guard_verifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: guard_verifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.guard_verifications_id_seq OWNED BY public.guard_verifications.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id bigint NOT NULL,
    user_id bigint,
    title character varying(200),
    message text,
    notification_type character varying(50),
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: parent_ratings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.parent_ratings (
    id bigint NOT NULL,
    parent_id bigint,
    driver_id bigint,
    child_id bigint,
    rating integer,
    comments text,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT parent_ratings_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


--
-- Name: parent_ratings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.parent_ratings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: parent_ratings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.parent_ratings_id_seq OWNED BY public.parent_ratings.id;


--
-- Name: push_subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.push_subscriptions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    endpoint text NOT NULL,
    p256dh text NOT NULL,
    auth text NOT NULL,
    user_agent text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: push_subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.push_subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: push_subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.push_subscriptions_id_seq OWNED BY public.push_subscriptions.id;


--
-- Name: push_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.push_tokens (
    id integer NOT NULL,
    user_id integer NOT NULL,
    token text NOT NULL,
    device_type character varying(20) DEFAULT 'android'::character varying,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: push_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.push_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: push_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.push_tokens_id_seq OWNED BY public.push_tokens.id;


--
-- Name: route_stops; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.route_stops (
    id bigint NOT NULL,
    route_id bigint,
    latitude numeric(10,7),
    longitude numeric(10,7),
    sequence_no integer
);


--
-- Name: route_stops_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.route_stops_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: route_stops_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.route_stops_id_seq OWNED BY public.route_stops.id;


--
-- Name: routes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.routes (
    id bigint NOT NULL,
    van_id bigint,
    name text,
    is_active boolean DEFAULT true,
    branch_id bigint
);


--
-- Name: routes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.routes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: routes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.routes_id_seq OWNED BY public.routes.id;


--
-- Name: school_branches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.school_branches (
    id bigint NOT NULL,
    school_id bigint NOT NULL,
    branch_name character varying(150) NOT NULL,
    address text NOT NULL,
    latitude numeric(10,8),
    longitude numeric(11,8),
    start_time time without time zone,
    end_time time without time zone,
    contact_number character varying(20),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: school_branches_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.school_branches_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: school_branches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.school_branches_id_seq OWNED BY public.school_branches.id;


--
-- Name: school_guards; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.school_guards (
    id bigint NOT NULL,
    guard_id bigint,
    branch_id bigint,
    approval_status character varying(20) DEFAULT 'PENDING'::character varying,
    approved_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    approved_by bigint,
    CONSTRAINT school_guards_approval_status_check CHECK (((approval_status)::text = ANY ((ARRAY['PENDING'::character varying, 'APPROVED'::character varying, 'REJECTED'::character varying])::text[])))
);


--
-- Name: school_guards_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.school_guards_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: school_guards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.school_guards_id_seq OWNED BY public.school_guards.id;


--
-- Name: school_service_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.school_service_requests (
    id bigint NOT NULL,
    parent_id bigint,
    school_name character varying(200) NOT NULL,
    school_address text,
    contact_email character varying(150),
    contact_phone character varying(20),
    status character varying(20) DEFAULT 'PENDING'::character varying,
    requested_at timestamp without time zone DEFAULT now(),
    reviewed_at timestamp without time zone,
    admin_notes text,
    CONSTRAINT school_service_requests_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'APPROVED'::character varying, 'REJECTED'::character varying])::text[])))
);


--
-- Name: school_service_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.school_service_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: school_service_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.school_service_requests_id_seq OWNED BY public.school_service_requests.id;


--
-- Name: school_working_days; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.school_working_days (
    id bigint NOT NULL,
    school_id bigint,
    working_date date NOT NULL,
    is_working boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: school_working_days_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.school_working_days_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: school_working_days_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.school_working_days_id_seq OWNED BY public.school_working_days.id;


--
-- Name: schools; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schools (
    id bigint NOT NULL,
    owner_user_id bigint,
    school_name character varying(150) NOT NULL,
    city character varying(100) DEFAULT 'RAWALPINDI'::character varying,
    is_active boolean DEFAULT true,
    service_active boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: schools_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.schools_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: schools_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.schools_id_seq OWNED BY public.schools.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    role character varying(20),
    full_name character varying(150),
    phone character varying(20),
    email character varying(150),
    password text,
    profile_photo character varying(500),
    is_verified boolean DEFAULT false,
    deleted_at timestamp without time zone,
    last_login timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    is_active boolean DEFAULT true,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['ADMIN'::character varying, 'DRIVER'::character varying, 'PARENT'::character varying, 'GUARD'::character varying, 'SCHOOL'::character varying, 'POLICE'::character varying])::text[])))
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users_otp; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_otp (
    id bigint NOT NULL,
    user_id bigint,
    otp character varying(6) NOT NULL,
    status character varying(20) DEFAULT 'PENDING'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    expires_at timestamp without time zone NOT NULL,
    CONSTRAINT users_otp_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'VERIFIED'::character varying, 'EXPIRED'::character varying])::text[])))
);


--
-- Name: users_otp_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_otp_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_otp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_otp_id_seq OWNED BY public.users_otp.id;


--
-- Name: van_eta_predictions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.van_eta_predictions (
    id bigint NOT NULL,
    van_id bigint,
    stop_id bigint,
    estimated_arrival timestamp without time zone,
    calculated_at timestamp without time zone DEFAULT now()
);


--
-- Name: van_eta_predictions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.van_eta_predictions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: van_eta_predictions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.van_eta_predictions_id_seq OWNED BY public.van_eta_predictions.id;


--
-- Name: van_ratings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.van_ratings (
    id bigint NOT NULL,
    van_id bigint,
    parent_id bigint,
    rating integer,
    comments text,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT van_ratings_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


--
-- Name: van_ratings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.van_ratings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: van_ratings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.van_ratings_id_seq OWNED BY public.van_ratings.id;


--
-- Name: van_tracking; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.van_tracking (
    id bigint NOT NULL,
    van_id bigint NOT NULL,
    latitude numeric(10,7),
    longitude numeric(10,7),
    recorded_at timestamp without time zone DEFAULT now() NOT NULL
)
PARTITION BY RANGE (recorded_at);


--
-- Name: van_tracking_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.van_tracking_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: van_tracking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.van_tracking_id_seq OWNED BY public.van_tracking.id;


--
-- Name: van_tracking_2026; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.van_tracking_2026 (
    id bigint DEFAULT nextval('public.van_tracking_id_seq'::regclass) NOT NULL,
    van_id bigint NOT NULL,
    latitude numeric(10,7),
    longitude numeric(10,7),
    recorded_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: van_tracking_2027; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.van_tracking_2027 (
    id bigint DEFAULT nextval('public.van_tracking_id_seq'::regclass) NOT NULL,
    van_id bigint NOT NULL,
    latitude numeric(10,7),
    longitude numeric(10,7),
    recorded_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: van_tracking_default; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.van_tracking_default (
    id bigint DEFAULT nextval('public.van_tracking_id_seq'::regclass) NOT NULL,
    van_id bigint NOT NULL,
    latitude numeric(10,7),
    longitude numeric(10,7),
    recorded_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: vans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vans (
    id bigint NOT NULL,
    driver_id bigint,
    number_plate character varying(30),
    capacity integer NOT NULL,
    fare numeric(10,2),
    gender_type character varying(20) DEFAULT 'MIXED'::character varying,
    photo_url text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT vans_capacity_check CHECK ((capacity > 0)),
    CONSTRAINT vans_gender_type_check CHECK (((gender_type)::text = ANY ((ARRAY['MIXED'::character varying, 'GIRLS_ONLY'::character varying, 'BOYS_ONLY'::character varying])::text[])))
);


--
-- Name: vans_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.vans_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: vans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.vans_id_seq OWNED BY public.vans.id;


--
-- Name: van_tracking_2026; Type: TABLE ATTACH; Schema: public; Owner: -
--

ALTER TABLE ONLY public.van_tracking ATTACH PARTITION public.van_tracking_2026 FOR VALUES FROM ('2026-01-01 00:00:00') TO ('2027-01-01 00:00:00');


--
-- Name: van_tracking_2027; Type: TABLE ATTACH; Schema: public; Owner: -
--

ALTER TABLE ONLY public.van_tracking ATTACH PARTITION public.van_tracking_2027 FOR VALUES FROM ('2027-01-01 00:00:00') TO ('2028-01-01 00:00:00');


--
-- Name: van_tracking_default; Type: TABLE ATTACH; Schema: public; Owner: -
--

ALTER TABLE ONLY public.van_tracking ATTACH PARTITION public.van_tracking_default DEFAULT;


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- Name: cash_payments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cash_payments ALTER COLUMN id SET DEFAULT nextval('public.cash_payments_id_seq'::regclass);


--
-- Name: child_leaves id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.child_leaves ALTER COLUMN id SET DEFAULT nextval('public.child_leaves_id_seq'::regclass);


--
-- Name: child_pickups id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.child_pickups ALTER COLUMN id SET DEFAULT nextval('public.child_pickups_id_seq'::regclass);


--
-- Name: children id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.children ALTER COLUMN id SET DEFAULT nextval('public.children_id_seq'::regclass);


--
-- Name: complaints id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints ALTER COLUMN id SET DEFAULT nextval('public.complaints_id_seq'::regclass);


--
-- Name: delay_reports id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.delay_reports ALTER COLUMN id SET DEFAULT nextval('public.delay_reports_id_seq'::regclass);


--
-- Name: driver_approvals id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.driver_approvals ALTER COLUMN id SET DEFAULT nextval('public.driver_approvals_id_seq'::regclass);


--
-- Name: driver_assign id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.driver_assign ALTER COLUMN id SET DEFAULT nextval('public.driver_assign_id_seq'::regclass);


--
-- Name: driver_documents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.driver_documents ALTER COLUMN id SET DEFAULT nextval('public.driver_documents_id_seq'::regclass);


--
-- Name: driver_ratings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.driver_ratings ALTER COLUMN id SET DEFAULT nextval('public.driver_ratings_id_seq'::regclass);


--
-- Name: guard_verifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guard_verifications ALTER COLUMN id SET DEFAULT nextval('public.guard_verifications_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: parent_ratings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parent_ratings ALTER COLUMN id SET DEFAULT nextval('public.parent_ratings_id_seq'::regclass);


--
-- Name: push_subscriptions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.push_subscriptions ALTER COLUMN id SET DEFAULT nextval('public.push_subscriptions_id_seq'::regclass);


--
-- Name: push_tokens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.push_tokens ALTER COLUMN id SET DEFAULT nextval('public.push_tokens_id_seq'::regclass);


--
-- Name: route_stops id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.route_stops ALTER COLUMN id SET DEFAULT nextval('public.route_stops_id_seq'::regclass);


--
-- Name: routes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.routes ALTER COLUMN id SET DEFAULT nextval('public.routes_id_seq'::regclass);


--
-- Name: school_branches id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school_branches ALTER COLUMN id SET DEFAULT nextval('public.school_branches_id_seq'::regclass);


--
-- Name: school_guards id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school_guards ALTER COLUMN id SET DEFAULT nextval('public.school_guards_id_seq'::regclass);


--
-- Name: school_service_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school_service_requests ALTER COLUMN id SET DEFAULT nextval('public.school_service_requests_id_seq'::regclass);


--
-- Name: school_working_days id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school_working_days ALTER COLUMN id SET DEFAULT nextval('public.school_working_days_id_seq'::regclass);


--
-- Name: schools id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools ALTER COLUMN id SET DEFAULT nextval('public.schools_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: users_otp id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_otp ALTER COLUMN id SET DEFAULT nextval('public.users_otp_id_seq'::regclass);


--
-- Name: van_eta_predictions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.van_eta_predictions ALTER COLUMN id SET DEFAULT nextval('public.van_eta_predictions_id_seq'::regclass);


--
-- Name: van_ratings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.van_ratings ALTER COLUMN id SET DEFAULT nextval('public.van_ratings_id_seq'::regclass);


--
-- Name: van_tracking id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.van_tracking ALTER COLUMN id SET DEFAULT nextval('public.van_tracking_id_seq'::regclass);


--
-- Name: vans id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vans ALTER COLUMN id SET DEFAULT nextval('public.vans_id_seq'::regclass);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: cash_payments cash_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cash_payments
    ADD CONSTRAINT cash_payments_pkey PRIMARY KEY (id);


--
-- Name: child_leaves child_leaves_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.child_leaves
    ADD CONSTRAINT child_leaves_pkey PRIMARY KEY (id);


--
-- Name: child_pickups child_pickups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.child_pickups
    ADD CONSTRAINT child_pickups_pkey PRIMARY KEY (id);


--
-- Name: children children_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.children
    ADD CONSTRAINT children_pkey PRIMARY KEY (id);


--
-- Name: complaints complaints_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_pkey PRIMARY KEY (id);


--
-- Name: delay_reports delay_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.delay_reports
    ADD CONSTRAINT delay_reports_pkey PRIMARY KEY (id);


--
-- Name: driver_approvals driver_approvals_driver_id_branch_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.driver_approvals
    ADD CONSTRAINT driver_approvals_driver_id_branch_id_key UNIQUE (driver_id, branch_id);


--
-- Name: driver_approvals driver_approvals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.driver_approvals
    ADD CONSTRAINT driver_approvals_pkey PRIMARY KEY (id);


--
-- Name: driver_assign driver_assign_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.driver_assign
    ADD CONSTRAINT driver_assign_pkey PRIMARY KEY (id);


--
-- Name: driver_documents driver_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.driver_documents
    ADD CONSTRAINT driver_documents_pkey PRIMARY KEY (id);


--
-- Name: driver_ratings driver_ratings_parent_id_child_id_driver_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.driver_ratings
    ADD CONSTRAINT driver_ratings_parent_id_child_id_driver_id_key UNIQUE (parent_id, child_id, driver_id);


--
-- Name: driver_ratings driver_ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.driver_ratings
    ADD CONSTRAINT driver_ratings_pkey PRIMARY KEY (id);


--
-- Name: guard_verifications guard_verifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guard_verifications
    ADD CONSTRAINT guard_verifications_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: parent_ratings parent_ratings_driver_id_child_id_parent_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parent_ratings
    ADD CONSTRAINT parent_ratings_driver_id_child_id_parent_id_key UNIQUE (driver_id, child_id, parent_id);


--
-- Name: parent_ratings parent_ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parent_ratings
    ADD CONSTRAINT parent_ratings_pkey PRIMARY KEY (id);


--
-- Name: push_subscriptions push_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.push_subscriptions
    ADD CONSTRAINT push_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: push_tokens push_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.push_tokens
    ADD CONSTRAINT push_tokens_pkey PRIMARY KEY (id);


--
-- Name: push_tokens push_tokens_user_id_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.push_tokens
    ADD CONSTRAINT push_tokens_user_id_token_key UNIQUE (user_id, token);


--
-- Name: route_stops route_stops_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.route_stops
    ADD CONSTRAINT route_stops_pkey PRIMARY KEY (id);


--
-- Name: routes routes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.routes
    ADD CONSTRAINT routes_pkey PRIMARY KEY (id);


--
-- Name: school_branches school_branches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school_branches
    ADD CONSTRAINT school_branches_pkey PRIMARY KEY (id);


--
-- Name: school_guards school_guards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school_guards
    ADD CONSTRAINT school_guards_pkey PRIMARY KEY (id);


--
-- Name: school_service_requests school_service_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school_service_requests
    ADD CONSTRAINT school_service_requests_pkey PRIMARY KEY (id);


--
-- Name: school_working_days school_working_days_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school_working_days
    ADD CONSTRAINT school_working_days_pkey PRIMARY KEY (id);


--
-- Name: school_working_days school_working_days_school_id_working_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school_working_days
    ADD CONSTRAINT school_working_days_school_id_working_date_key UNIQUE (school_id, working_date);


--
-- Name: schools schools_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_pkey PRIMARY KEY (id);


--
-- Name: push_subscriptions unique_endpoint; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.push_subscriptions
    ADD CONSTRAINT unique_endpoint UNIQUE (endpoint);


--
-- Name: push_subscriptions unique_user_endpoint; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.push_subscriptions
    ADD CONSTRAINT unique_user_endpoint UNIQUE (user_id, endpoint);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users_otp users_otp_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_otp
    ADD CONSTRAINT users_otp_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: van_eta_predictions van_eta_predictions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.van_eta_predictions
    ADD CONSTRAINT van_eta_predictions_pkey PRIMARY KEY (id);


--
-- Name: van_ratings van_ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.van_ratings
    ADD CONSTRAINT van_ratings_pkey PRIMARY KEY (id);


--
-- Name: van_tracking van_tracking_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.van_tracking
    ADD CONSTRAINT van_tracking_pkey PRIMARY KEY (id, recorded_at);


--
-- Name: van_tracking_2026 van_tracking_2026_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.van_tracking_2026
    ADD CONSTRAINT van_tracking_2026_pkey PRIMARY KEY (id, recorded_at);


--
-- Name: van_tracking_2027 van_tracking_2027_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.van_tracking_2027
    ADD CONSTRAINT van_tracking_2027_pkey PRIMARY KEY (id, recorded_at);


--
-- Name: van_tracking_default van_tracking_default_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.van_tracking_default
    ADD CONSTRAINT van_tracking_default_pkey PRIMARY KEY (id, recorded_at);


--
-- Name: vans vans_number_plate_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vans
    ADD CONSTRAINT vans_number_plate_key UNIQUE (number_plate);


--
-- Name: vans vans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vans
    ADD CONSTRAINT vans_pkey PRIMARY KEY (id);


--
-- Name: idx_branch_school; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_branch_school ON public.school_branches USING btree (school_id);


--
-- Name: idx_driver_rating; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_driver_rating ON public.driver_ratings USING btree (driver_id, rating DESC);


--
-- Name: idx_notifications_unread; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_unread ON public.notifications USING btree (user_id, is_read);


--
-- Name: idx_notifications_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_user ON public.notifications USING btree (user_id);


--
-- Name: idx_push_tokens_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_push_tokens_user ON public.push_tokens USING btree (user_id);


--
-- Name: idx_push_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_push_user ON public.push_subscriptions USING btree (user_id);


--
-- Name: idx_tracking_van_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tracking_van_time ON ONLY public.van_tracking USING btree (van_id, recorded_at DESC);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_phone; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_phone ON public.users USING btree (phone);


--
-- Name: idx_van_tracking_van_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_van_tracking_van_time ON ONLY public.van_tracking USING btree (van_id, recorded_at DESC);


--
-- Name: idx_van_tracking_2026_van_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_van_tracking_2026_van_id ON public.van_tracking_2026 USING btree (van_id, recorded_at DESC);


--
-- Name: idx_van_tracking_2027_van_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_van_tracking_2027_van_id ON public.van_tracking_2026 USING btree (van_id, recorded_at DESC);


--
-- Name: idx_vans_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_vans_active ON public.vans USING btree (is_active);


--
-- Name: idx_vans_driver_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_vans_driver_id ON public.vans USING btree (driver_id);


--
-- Name: idx_working_school_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_working_school_date ON public.school_working_days USING btree (school_id, working_date);


--
-- Name: uq_active_booking; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_active_booking ON public.bookings USING btree (child_id) WHERE ((status)::text = 'ACTIVE'::text);


--
-- Name: uq_daily_pickup; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_daily_pickup ON public.child_pickups USING btree (child_id, date(pickup_time));


--
-- Name: van_tracking_2026_van_id_recorded_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX van_tracking_2026_van_id_recorded_at_idx ON public.van_tracking_2026 USING btree (van_id, recorded_at DESC);


--
-- Name: van_tracking_2027_van_id_recorded_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX van_tracking_2027_van_id_recorded_at_idx ON public.van_tracking_2027 USING btree (van_id, recorded_at DESC);


--
-- Name: van_tracking_2027_van_id_recorded_at_idx1; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX van_tracking_2027_van_id_recorded_at_idx1 ON public.van_tracking_2027 USING btree (van_id, recorded_at DESC);


--
-- Name: van_tracking_default_van_id_recorded_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX van_tracking_default_van_id_recorded_at_idx ON public.van_tracking_default USING btree (van_id, recorded_at DESC);


--
-- Name: van_tracking_default_van_id_recorded_at_idx1; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX van_tracking_default_van_id_recorded_at_idx1 ON public.van_tracking_default USING btree (van_id, recorded_at DESC);


--
-- Name: idx_van_tracking_2026_van_id; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.idx_van_tracking_van_time ATTACH PARTITION public.idx_van_tracking_2026_van_id;


--
-- Name: van_tracking_2026_pkey; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.van_tracking_pkey ATTACH PARTITION public.van_tracking_2026_pkey;


--
-- Name: van_tracking_2026_van_id_recorded_at_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.idx_tracking_van_time ATTACH PARTITION public.van_tracking_2026_van_id_recorded_at_idx;


--
-- Name: van_tracking_2027_pkey; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.van_tracking_pkey ATTACH PARTITION public.van_tracking_2027_pkey;


--
-- Name: van_tracking_2027_van_id_recorded_at_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.idx_tracking_van_time ATTACH PARTITION public.van_tracking_2027_van_id_recorded_at_idx;


--
-- Name: van_tracking_2027_van_id_recorded_at_idx1; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.idx_van_tracking_van_time ATTACH PARTITION public.van_tracking_2027_van_id_recorded_at_idx1;


--
-- Name: van_tracking_default_pkey; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.van_tracking_pkey ATTACH PARTITION public.van_tracking_default_pkey;


--
-- Name: van_tracking_default_van_id_recorded_at_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.idx_tracking_van_time ATTACH PARTITION public.van_tracking_default_van_id_recorded_at_idx;


--
-- Name: van_tracking_default_van_id_recorded_at_idx1; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.idx_van_tracking_van_time ATTACH PARTITION public.van_tracking_default_van_id_recorded_at_idx1;


--
-- Name: bookings bookings_van_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_van_id_fkey FOREIGN KEY (van_id) REFERENCES public.vans(id);


--
-- Name: cash_payments cash_payments_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cash_payments
    ADD CONSTRAINT cash_payments_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE;


--
-- Name: children children_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.children
    ADD CONSTRAINT children_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.school_branches(id) ON DELETE CASCADE;


--
-- Name: children children_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.children
    ADD CONSTRAINT children_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: complaints complaints_child_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_child_id_fkey FOREIGN KEY (child_id) REFERENCES public.children(id);


--
-- Name: complaints complaints_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id);


--
-- Name: delay_reports delay_reports_route_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.delay_reports
    ADD CONSTRAINT delay_reports_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.routes(id) ON DELETE SET NULL;


--
-- Name: driver_approvals driver_approvals_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.driver_approvals
    ADD CONSTRAINT driver_approvals_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id);


--
-- Name: driver_approvals driver_approvals_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.driver_approvals
    ADD CONSTRAINT driver_approvals_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.school_branches(id) ON DELETE CASCADE;


--
-- Name: driver_approvals driver_approvals_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.driver_approvals
    ADD CONSTRAINT driver_approvals_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: guard_verifications guard_verifications_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guard_verifications
    ADD CONSTRAINT guard_verifications_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.school_branches(id);


--
-- Name: guard_verifications guard_verifications_child_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guard_verifications
    ADD CONSTRAINT guard_verifications_child_id_fkey FOREIGN KEY (child_id) REFERENCES public.children(id);


--
-- Name: guard_verifications guard_verifications_guard_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guard_verifications
    ADD CONSTRAINT guard_verifications_guard_id_fkey FOREIGN KEY (guard_id) REFERENCES public.users(id);


--
-- Name: guard_verifications guard_verifications_van_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guard_verifications
    ADD CONSTRAINT guard_verifications_van_id_fkey FOREIGN KEY (van_id) REFERENCES public.vans(id);


--
-- Name: push_subscriptions push_subscriptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.push_subscriptions
    ADD CONSTRAINT push_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: route_stops route_stops_route_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.route_stops
    ADD CONSTRAINT route_stops_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.routes(id) ON DELETE CASCADE;


--
-- Name: routes routes_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.routes
    ADD CONSTRAINT routes_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.school_branches(id);


--
-- Name: school_branches school_branches_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school_branches
    ADD CONSTRAINT school_branches_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id) ON DELETE CASCADE;


--
-- Name: school_guards school_guards_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school_guards
    ADD CONSTRAINT school_guards_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id);


--
-- Name: school_guards school_guards_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school_guards
    ADD CONSTRAINT school_guards_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.school_branches(id);


--
-- Name: school_guards school_guards_guard_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school_guards
    ADD CONSTRAINT school_guards_guard_id_fkey FOREIGN KEY (guard_id) REFERENCES public.users(id);


--
-- Name: van_eta_predictions van_eta_predictions_stop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.van_eta_predictions
    ADD CONSTRAINT van_eta_predictions_stop_id_fkey FOREIGN KEY (stop_id) REFERENCES public.route_stops(id) ON DELETE CASCADE;


--
-- Name: van_eta_predictions van_eta_predictions_van_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.van_eta_predictions
    ADD CONSTRAINT van_eta_predictions_van_id_fkey FOREIGN KEY (van_id) REFERENCES public.vans(id) ON DELETE CASCADE;


--
-- Name: van_tracking van_tracking_van_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE public.van_tracking
    ADD CONSTRAINT van_tracking_van_id_fkey FOREIGN KEY (van_id) REFERENCES public.vans(id);


--
-- PostgreSQL database dump complete
--

\unrestrict Y72Qv2BxM9SK10Qe9IZCSF5obL6aFkc0qN6ldyauMaax5MbXjcWshv69v3jYoC3

