--
-- PostgreSQL database dump
--

\restrict DKk1CXfUoOyzle9UM7FBP9z3L2qw09rjLVGdJgN4t6nHWpNNxKMG3pqaFs3cRAU

-- Dumped from database version 18.2
-- Dumped by pg_dump version 18.2

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
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    image_url character varying(255)
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: customization_options; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customization_options (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    options jsonb NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.customization_options OWNER TO postgres;

--
-- Name: customization_options_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customization_options_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customization_options_id_seq OWNER TO postgres;

--
-- Name: customization_options_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customization_options_id_seq OWNED BY public.customization_options.id;


--
-- Name: delivery_areas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.delivery_areas (
    id integer NOT NULL,
    pincode character varying(10) NOT NULL,
    area_name character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.delivery_areas OWNER TO postgres;

--
-- Name: delivery_areas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.delivery_areas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.delivery_areas_id_seq OWNER TO postgres;

--
-- Name: delivery_areas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.delivery_areas_id_seq OWNED BY public.delivery_areas.id;


--
-- Name: delivery_partners; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.delivery_partners (
    id integer NOT NULL,
    user_id integer,
    vehicle_type character varying(100),
    status character varying(50) DEFAULT 'available'::character varying
);


ALTER TABLE public.delivery_partners OWNER TO postgres;

--
-- Name: delivery_partners_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.delivery_partners_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.delivery_partners_id_seq OWNER TO postgres;

--
-- Name: delivery_partners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.delivery_partners_id_seq OWNED BY public.delivery_partners.id;


--
-- Name: local_deliveries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.local_deliveries (
    id integer NOT NULL,
    order_id integer,
    delivery_partner_id integer,
    delivery_status character varying(50) DEFAULT 'pending'::character varying,
    assigned_at timestamp without time zone,
    delivered_at timestamp without time zone
);


ALTER TABLE public.local_deliveries OWNER TO postgres;

--
-- Name: local_deliveries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.local_deliveries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.local_deliveries_id_seq OWNER TO postgres;

--
-- Name: local_deliveries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.local_deliveries_id_seq OWNED BY public.local_deliveries.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer,
    product_id integer,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    product_type character varying(50) NOT NULL,
    weight character varying(50),
    product_name character varying(255),
    customization_choices jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_id_seq OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer,
    total_amount numeric(10,2) NOT NULL,
    payment_status character varying(50) DEFAULT 'pending'::character varying,
    order_status character varying(50) DEFAULT 'processing'::character varying,
    delivery_method character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    shipping_address jsonb,
    delivery_fee numeric(10,2) DEFAULT 0.00,
    discount numeric(10,2) DEFAULT 0.00,
    customization_notes text,
    customization_choices jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    order_id integer,
    gateway character varying(50) DEFAULT 'paytm'::character varying,
    transaction_id character varying(255),
    payment_status character varying(50) DEFAULT 'pending'::character varying,
    amount numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_id_seq OWNER TO postgres;

--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    category character varying(100),
    product_type character varying(50) NOT NULL,
    image_url character varying(255),
    stock integer DEFAULT 0,
    is_available boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    weight character varying(100),
    food_type character varying(20) DEFAULT 'veg'::character varying,
    price_250g numeric(10,2),
    price_500g numeric(10,2),
    price_1kg numeric(10,2),
    available_250g boolean DEFAULT true,
    available_500g boolean DEFAULT true,
    available_1kg boolean DEFAULT true,
    discount_percentage integer DEFAULT 0,
    customization_ids jsonb DEFAULT '[]'::jsonb
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: shipments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipments (
    id integer NOT NULL,
    order_id integer,
    shiprocket_order_id character varying(255),
    shiprocket_shipment_id character varying(255),
    tracking_number character varying(255),
    courier_name character varying(255),
    shipping_status character varying(50) DEFAULT 'pending'::character varying
);


ALTER TABLE public.shipments OWNER TO postgres;

--
-- Name: shipments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shipments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shipments_id_seq OWNER TO postgres;

--
-- Name: shipments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shipments_id_seq OWNED BY public.shipments.id;


--
-- Name: site_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.site_settings (
    key character varying(100) NOT NULL,
    value text NOT NULL
);


ALTER TABLE public.site_settings OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    phone character varying(20),
    role character varying(50) DEFAULT 'customer'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    google_id character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: customization_options id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customization_options ALTER COLUMN id SET DEFAULT nextval('public.customization_options_id_seq'::regclass);


--
-- Name: delivery_areas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery_areas ALTER COLUMN id SET DEFAULT nextval('public.delivery_areas_id_seq'::regclass);


--
-- Name: delivery_partners id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery_partners ALTER COLUMN id SET DEFAULT nextval('public.delivery_partners_id_seq'::regclass);


--
-- Name: local_deliveries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.local_deliveries ALTER COLUMN id SET DEFAULT nextval('public.local_deliveries_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: shipments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipments ALTER COLUMN id SET DEFAULT nextval('public.shipments_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, image_url) FROM stdin;
1	All Products	https://cdn-icons-png.flaticon.com/512/3724/3724820.png
6	Snacks	https://cdn-icons-png.flaticon.com/512/2515/2515124.png
7	Sweets	https://cdn-icons-png.flaticon.com/512/2454/2454219.png
11	Powders	https://cdn-icons-png.flaticon.com/512/7513/7513511.png
12	Papads	https://cdn-icons-png.flaticon.com/512/4241/4241198.png
18	Seasonal	https://cdn-icons-png.flaticon.com/512/3068/3068565.png
5	Non-Veg Pickles	https://cdn-icons-png.flaticon.com/512/3143/3143643.png
20	bakery	https://res.cloudinary.com/dokwogdfu/image/upload/v1773327397/uiyq5f8jubvf4trnjsbq.jpg
19	Veg Pickles	https://res.cloudinary.com/dokwogdfu/image/upload/v1773327419/wzbkhbmksevvaynznef3.webp
8	Chocolates	https://res.cloudinary.com/dokwogdfu/image/upload/v1773327756/qojlcw3ylextmxt0jved.jpg
21	mixtures	https://res.cloudinary.com/dokwogdfu/image/upload/v1773336326/zafnkxsq1lsdhlfxe1nx.webp
\.


--
-- Data for Name: customization_options; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customization_options (id, name, options, is_active, created_at) FROM stdin;
1	Spice Level	["Mild", "Medium", "Spicy"]	t	2026-03-26 11:40:41.089643
2	Oil Preference	["Regular", "Less Oil"]	t	2026-03-26 11:40:41.09485
3	Packaging	["Normal", "Gift Pack"]	t	2026-03-26 11:40:41.096955
\.


--
-- Data for Name: delivery_areas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.delivery_areas (id, pincode, area_name, created_at) FROM stdin;
16	533437	Peddapuram	2026-03-26 10:37:58.406817
\.


--
-- Data for Name: delivery_partners; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.delivery_partners (id, user_id, vehicle_type, status) FROM stdin;
\.


--
-- Data for Name: local_deliveries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.local_deliveries (id, order_id, delivery_partner_id, delivery_status, assigned_at, delivered_at) FROM stdin;
1	10	\N	pending	\N	\N
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, product_id, quantity, price, product_type, weight, product_name, customization_choices) FROM stdin;
1	1	7	2	495.00	packaged	\N	\N	{}
2	2	4	1	300.00	packaged	\N	\N	{}
3	3	7	1	90.00	packaged	\N	\N	{}
4	4	7	1	90.00	packaged	\N	\N	{}
5	5	7	1	439.00	packaged	500g	chicken pickle	{}
6	6	7	1	900.00	packaged	1kg	chicken pickle	{}
7	7	7	1	439.00	packaged	500g	chicken pickle	{}
8	8	7	1	900.00	packaged	1kg	chicken pickle	{}
9	9	7	1	439.00	packaged	500g	chicken pickle	{}
10	10	6	1	482.00	fresh	500g	Plum Cake	{}
11	11	10	1	500.00	packaged	500g	Aresalu	{"Packaging": "Normal", "Spice Level": "Medium", "Oil Preference": "Regular"}
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, user_id, total_amount, payment_status, order_status, delivery_method, created_at, shipping_address, delivery_fee, discount, customization_notes, customization_choices) FROM stdin;
1	10	1090.00	paid	processing	courier	2026-03-17 11:21:25.380644	{"city": "Peddapuram ", "address": "Peddapuram ", "postalCode": "533437"}	0.00	0.00	\N	{}
2	11	400.00	paid	processing	courier	2026-03-17 11:29:27.701923	{"city": "Peddapuram ", "address": "Peddapuram ", "postalCode": "533437"}	0.00	0.00	\N	{}
3	12	190.00	paid	processing	courier	2026-03-21 14:25:47.094704	{"city": "Mummidivaram", "state": "Telangana", "pincode": "533216", "village": "", "landmark": "", "postalCode": "533216", "addressLine1": "Lbs", "addressLine2": "8-132, Grandhi street , mummidivaram"}	0.00	0.00	\N	{}
4	11	190.00	paid	processing	courier	2026-03-21 14:30:56.626502	{"city": "DURGAPUR ", "state": "West Bengal ", "pincode": "533437", "village": " ", "landmark": "NIT DURGAPUR ", "postalCode": "533437", "addressLine1": "Hall 11", "addressLine2": "NIT Durgapur "}	0.00	0.00	\N	{}
5	13	539.00	paid	processing	courier	2026-03-21 16:36:39.137753	{"city": "peddapuram", "email": "mummidijyothisri06@gmail.com", "phone": "9177478809", "state": "Andhra Pradesh", "pincode": "533437", "village": "kattamuru", "altPhone": "8897987998", "landmark": "shivalayam e", "lastName": "Mummidi", "firstName": "Jyothisri", "postalCode": "533437", "addressLine1": "123", "addressLine2": "Shivalayam street"}	0.00	0.00	\N	{}
6	8	1000.00	paid	processing	courier	2026-03-21 20:21:49.049372	{"city": "Hyderabad", "email": "admin@sdfoods.com", "phone": "9000000000", "state": "Telangana", "pincode": "500001", "village": "", "altPhone": "", "landmark": "", "lastName": "User", "firstName": "Admin", "postalCode": "500001", "addressLine1": "123", "addressLine2": "Main St"}	100.00	0.00	\N	{}
7	11	539.00	paid	processing	courier	2026-03-22 14:54:04.152554	{"city": "Church", "email": "mokshajna05@gmail.com", "phone": "81212337653", "state": "Telangana", "pincode": "533437", "village": "Gg", "altPhone": "9177478806", "landmark": "Nuvvu", "lastName": "Mummidi", "firstName": "Mokshajna", "postalCode": "533437", "addressLine1": "Bun", "addressLine2": "Baingan"}	100.00	0.00	\N	{}
8	14	1000.00	paid	processing	courier	2026-03-23 19:43:33.632175	{"city": "samalkota", "email": "abhishekarumilli773@gmail.com", "phone": "8520042438", "state": "Andhra Pradesh", "pincode": "533437", "village": "G.Ragampeta", "altPhone": "", "landmark": "Govt. school", "lastName": "ABHISHEK", "firstName": "ARUMILLI", "postalCode": "533437", "addressLine1": "2-47", "addressLine2": "main road"}	100.00	0.00	\N	{}
9	8	539.00	paid	processing	courier	2026-03-24 12:46:10.035355	{"city": "Hyderabad", "email": "admin@sdfoods.com", "phone": "1234567890", "state": "Telangana", "pincode": "500001", "village": "", "altPhone": "", "landmark": "Near HDFC Bank", "lastName": "User", "firstName": "Admin", "postalCode": "500001", "addressLine1": "123 Sai Residency", "addressLine2": ""}	100.00	0.00	\N	{}
10	13	532.00	paid	processing	local	2026-03-26 10:38:51.285596	{"city": "East Godavari", "email": "mummidijyothisri06@gmail.com", "phone": "9177478809", "state": "Andhra Pradesh", "pincode": "533437", "village": "Peddapuram", "altPhone": "", "landmark": "excise office", "lastName": "Mummidi", "firstName": "Jyothisri", "postalCode": "533437", "addressLine1": "1234", "addressLine2": "Shivalayam street"}	50.00	0.00	\N	{}
11	13	600.00	paid	processing	courier	2026-03-26 12:59:23.943198	{"city": "East Godavari", "email": "mummidijyothisri06@gmail.com", "phone": "9177478809", "state": "Andhra Pradesh", "pincode": "533437", "village": "Kattamuru", "altPhone": "8897987998", "landmark": "near excise office", "lastName": "Mummidi", "firstName": "Jyothisri", "postalCode": "533437", "addressLine1": "12344", "addressLine2": "Shivalayam street"}	100.00	0.00	\N	{}
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, order_id, gateway, transaction_id, payment_status, amount, created_at) FROM stdin;
1	1	paytm	mock_paytm_txn_token_1773726685628	success	1090.00	2026-03-17 11:21:25.380644
2	2	paytm	mock_paytm_txn_token_1773727167968	success	400.00	2026-03-17 11:29:27.701923
3	3	paytm	mock_paytm_txn_token_1774083347309	success	190.00	2026-03-21 14:25:47.094704
4	4	paytm	mock_paytm_txn_token_1774083656788	success	190.00	2026-03-21 14:30:56.626502
5	5	paytm	mock_paytm_txn_token_1774091199219	success	539.00	2026-03-21 16:36:39.137753
6	6	paytm	mock_paytm_txn_token_1774104709276	success	1000.00	2026-03-21 20:21:49.049372
7	7	paytm	mock_paytm_txn_token_1774171444359	success	539.00	2026-03-22 14:54:04.152554
8	8	paytm	mock_paytm_txn_token_1774275213847	success	1000.00	2026-03-23 19:43:33.632175
9	9	paytm	mock_paytm_txn_token_1774336570485	success	539.00	2026-03-24 12:46:10.035355
10	10	paytm	mock_paytm_txn_token_1774501731330	success	532.00	2026-03-26 10:38:51.285596
11	11	paytm	mock_paytm_txn_token_1774510164031	success	600.00	2026-03-26 12:59:23.943198
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, description, price, category, product_type, image_url, stock, is_available, created_at, weight, food_type, price_250g, price_500g, price_1kg, available_250g, available_500g, available_1kg, discount_percentage, customization_ids) FROM stdin;
1	Black Forest Cake	Classic chocolate sponge cake layered with cherry filling and whipped cream, topped with chocolate shavings.	650.00	cakes	fresh	https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80	10	t	2026-03-12 12:55:32.561274	\N	veg	650.00	650.00	650.00	t	t	t	0	[]
2	Red Velvet Cake	Moist red velvet cake layers with smooth cream cheese frosting. A visual and culinary delight.	750.00	cakes	fresh	https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80	8	t	2026-03-12 12:55:32.573539	\N	veg	750.00	750.00	750.00	t	t	t	0	[]
3	Premium Assorted Cookies Box	A delightful assortment of handmade butter, chocolate chip, and oatmeal cookies.	450.00	cookies	packaged	https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80	50	t	2026-03-12 12:55:32.574774	\N	veg	450.00	450.00	450.00	t	t	t	0	[]
10	Aresalu	null	250.00	All Products, Sweets	packaged	https://res.cloudinary.com/dokwogdfu/image/upload/v1774502934/gcd10ngiibmfubp8nsww.jpg	0	t	2026-03-26 10:58:57.471848		veg	250.00	500.00	1000.00	t	t	t	0	[3, 2, 1]
4	Spicy Mango Pickle (500g)	Authentic South Indian style spicy, tangy, and flavorsome mango pickle.	300.00	pickles	packaged	https://res.cloudinary.com/dokwogdfu/image/upload/v1773563943/njfhl1khd3pwmleldt8r.webp	30	t	2026-03-12 12:55:32.577263		veg	300.00	300.00	300.00	t	t	t	0	[]
7	chicken pickle	chiken pickle	300.00	All Products, Non-Veg Pickles	packaged	https://res.cloudinary.com/dokwogdfu/image/upload/v1773563915/cl1uejunzdbkk3jvhx2z.jpg	10	t	2026-03-15 14:08:36.050374	250g	non-veg	300.00	600.00	1200.00	f	t	t	10	[]
6	Plum Cake	plum cake	268.00	All Products, bakery	fresh	https://res.cloudinary.com/dokwogdfu/image/upload/v1773394123/r4qemnjpldyrmuubsvvt.jpg	20	t	2026-03-13 14:58:43.501161	\N	veg	268.00	268.00	268.00	t	t	t	0	[]
9	Ghee	\N	250.00	\N	fresh	https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=800&q=80	10	t	2026-03-25 22:09:27.523274	\N	veg	250.00	450.00	800.00	t	t	t	0	[]
\.


--
-- Data for Name: shipments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipments (id, order_id, shiprocket_order_id, shiprocket_shipment_id, tracking_number, courier_name, shipping_status) FROM stdin;
1	1	\N	\N	\N	\N	pending
2	2	\N	\N	\N	\N	pending
3	3	\N	\N	\N	\N	pending
4	4	\N	\N	\N	\N	pending
5	5	\N	\N	\N	\N	pending
6	6	\N	\N	\N	\N	pending
7	7	\N	\N	\N	\N	pending
8	8	\N	\N	\N	\N	pending
9	9	\N	\N	\N	\N	pending
10	11	\N	\N	\N	\N	pending
\.


--
-- Data for Name: site_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.site_settings (key, value) FROM stdin;
business_website	sdfoods.in
business_name	JeJi Vantalu
business_email	jejivantalu@gmail.com
business_phone	+91 76709 26071
help_message	Experiencing delays? Reach out to support!
business_address	Peddapuram , Andhra Pradesh , India
address_line_2	Commercial Zone 4, Hyderabad
fssai_reg	Registered FSSAI Unit
quality_assurance	Homemade Quality Assurance
support_phone	
hero_title	Best Homemade Food in Town
hero_description	Fresh and healthy meals delivered to your doorstep.
logo_url	https://res.cloudinary.com/dokwogdfu/image/upload/v1774448869/mthbtma0nvv5x6mm1o2e.png
hero_video_url	/videos/Animated video hero section.mp4
facebook_url	
instagram_url	https://www.instagram.com/jejivantalu?igsh=MTBreHU5bXZiaWp3MQ==
twitter_url	
youtube_url	
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password_hash, phone, role, created_at, google_id) FROM stdin;
3	Test Admin	admin1773304382317@test.com	$2b$10$8wl.rvPjqRngLmH2mLEs1u0OOGdYKTG0ABe0uq9fG0nQM2zL6q7r2	1234567890	admin	2026-03-12 14:03:02.677416	\N
4	Test Admin	admin1773304407897@test.com	$2b$10$nnHEWgc4NyOLJyCrkOiQ2OhLKSieHtz2x85LUiJirAjXbTNDjOZBe	1234567890	admin	2026-03-12 14:03:28.099626	\N
5	Test Admin	admin1773304465977@test.com	$2b$10$73u7O7XMJXoJL98v7dYADOTe3iLidclOrU4BGwhyJjYpJXLfi9Nju	1234567890	admin	2026-03-12 14:04:26.33356	\N
6	Test Admin	admin1773304810926@test.com	$2b$10$uGOc2rysLqBtryPBQxYkLuQpb.bUtd.cRGG0.8ZJBp4atkXA4wpcW	1234567890	admin	2026-03-12 14:10:11.116065	\N
7	Admin Test	testadmin@sdfoods.com	$2b$10$qjCT4mathkSArdaWdDaV6u7E9dKWQngcp3uAX88.tQ13WkUDLyEdW	1234567890	customer	2026-03-12 23:10:47.594501	\N
9	qwer	qwer@gmail.com	$2b$10$yux/99exea5BPSq5OFxz8OoWY5XtDTCbV2d/T24lIZRJaFXzZcKYG	9177478809	customer	2026-03-13 11:52:16.272156	\N
10	Jyo	jyothisrimummidi664@gmail.com	$2b$10$0g9c4bWv6ksis4cOD8X.DOWU7LSgid4PZFPpMJuw1gPMiPqM7t9Ey	9177478809	customer	2026-03-14 09:06:04.821985	\N
11	Mokshajna Mummidi	mokshajna05@gmail.com	$2b$10$T.P6iCx7ZjNHUVeVEJuNxOA7pQfY/V/dzsLtMXxmTCbBHyjjXf5iK	8121337653	customer	2026-03-17 11:24:32.66236	\N
12	Lohith	lohithgrandhi08@gmail.com	$2b$10$0TnujL0/m8NoKbWn6ty1Dub/jF0CcIivSBCYhvUEBGXelO0rY/JS2	9133528128	customer	2026-03-21 14:23:39.062832	\N
8	Admin User	admin@sdfoods.com	$2b$10$kF5rdDDqmmPVV3MGAygSFOVXaEi2tV/1m/U.XxHh4OF22xsiu36Nm	9876543210	admin	2026-03-13 07:14:12.587173	\N
14	ARUMILLI ABHISHEK	abhishekarumilli773@gmail.com	$2b$10$YyFh0uujY89ruGmwfhZ11OtG4A4.kXJ9JOkl4hbY8/7JqlxP9Boi.	8520042438	customer	2026-03-23 19:40:50.857451	\N
15	Test User	test_phone_login_06@example.com	$2b$10$3CGz3dhR7vH/nUZcg7rFaOMPpsx/Ak2KkBAsCw53Rd.63RiSxRw2G	9876543210	customer	2026-03-25 22:27:45.23929	\N
16	Test User	testuser_unique_99@example.com	$2b$10$tm8mRFQwNJygtu5De09YVOSGtLiaVgQUFMJO1MtCw7KQ7n.ecGiSK	9876543210	customer	2026-03-25 22:29:46.65467	\N
17	Test User	testuser_unique_v1@example.com	$2b$10$5zabOpKO28P1h8v/AyQijOhdD52rlS3dRKWzDo.Yy2YxMZxLMOcdS	9876543210	customer	2026-03-25 22:31:46.331954	\N
18	Test User	v3_user@test.com	$2b$10$geK2o5PUIC.u4AagJFvSZub7dtkaq3Sfuc9bwO2ePQ7ogdkJf43/e	9876543210	customer	2026-03-25 22:34:06.745143	\N
19	Test	simple@test.com	$2b$10$N/hORGSNC.uJyy0Q9qZ.z.W4FFbkozShvTVWnB7.7fdJLQqk6yA92	9876543210	customer	2026-03-25 22:37:08.221542	\N
20	Test User	verified_email_login_v1@test.com	$2b$10$TaxDMeC5GrnJMvELnMymNef7MVO5jEvHjldDXVdyHI8jvwn2RSeBa	9999999999	customer	2026-03-25 22:38:54.370167	\N
1	Jeji Vantalu	jejivantalu@gmail.com	$2b$10$btFCM60W4sh.GlcmDrpXQeo3a1.jdSdgpLJO66GPtixhAnd6biGDO	\N	admin	2026-03-12 12:55:32.680998	102679143095558613572
13	Jyothisri Mummidi	mummidijyothisri06@gmail.com	$2b$10$D7T0zs7tltPEoUK1D9W4o.jRxdUvPf7kgzvCv00ZJbWDdlOO2.WTS	9177478809	customer	2026-03-21 16:35:20.918012	110807315543222693356
\.


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 24, true);


--
-- Name: customization_options_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customization_options_id_seq', 3, true);


--
-- Name: delivery_areas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.delivery_areas_id_seq', 16, true);


--
-- Name: delivery_partners_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.delivery_partners_id_seq', 1, false);


--
-- Name: local_deliveries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.local_deliveries_id_seq', 1, true);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_id_seq', 11, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 11, true);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_id_seq', 11, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 12, true);


--
-- Name: shipments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shipments_id_seq', 10, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 20, true);


--
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: customization_options customization_options_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customization_options
    ADD CONSTRAINT customization_options_pkey PRIMARY KEY (id);


--
-- Name: delivery_areas delivery_areas_pincode_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery_areas
    ADD CONSTRAINT delivery_areas_pincode_key UNIQUE (pincode);


--
-- Name: delivery_areas delivery_areas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery_areas
    ADD CONSTRAINT delivery_areas_pkey PRIMARY KEY (id);


--
-- Name: delivery_partners delivery_partners_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery_partners
    ADD CONSTRAINT delivery_partners_pkey PRIMARY KEY (id);


--
-- Name: local_deliveries local_deliveries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.local_deliveries
    ADD CONSTRAINT local_deliveries_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: shipments shipments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT shipments_pkey PRIMARY KEY (id);


--
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (key);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_google_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_google_id_key UNIQUE (google_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: delivery_partners delivery_partners_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery_partners
    ADD CONSTRAINT delivery_partners_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: local_deliveries local_deliveries_delivery_partner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.local_deliveries
    ADD CONSTRAINT local_deliveries_delivery_partner_id_fkey FOREIGN KEY (delivery_partner_id) REFERENCES public.delivery_partners(id);


--
-- Name: local_deliveries local_deliveries_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.local_deliveries
    ADD CONSTRAINT local_deliveries_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: payments payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: shipments shipments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT shipments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- PostgreSQL database dump complete
--

\unrestrict DKk1CXfUoOyzle9UM7FBP9z3L2qw09rjLVGdJgN4t6nHWpNNxKMG3pqaFs3cRAU

