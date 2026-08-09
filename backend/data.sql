--
-- PostgreSQL database dump
--

\restrict FRaikhdKgIFNtvdZnGXPy3QEXlP5RpfezjDWvtApPEpdRH6Ftcu0eddCv4kqPJ0

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

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

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
8d5d7413-bda0-4b08-b432-354e7ff075a0	394ecbe7332a5097a77d2e68e99f5dca735879e41e9b883766cda68402729458	2026-08-08 18:36:46.656564+05:30	20260808080450_init	\N	\N	2026-08-08 18:36:46.568347+05:30	1
15f8e9e4-fa6d-43a9-aada-ec10b0a0eb17	c9a4fe50bed995916ef94f0622f8a00aa32292dc0cd211f72dfffaa1f690b32f	2026-08-08 18:36:46.660394+05:30	20260808130541_make_customer_email_unique	\N	\N	2026-08-08 18:36:46.657265+05:30	1
0cceddfa-60f1-42fa-8e49-754ec520ebcf	0ca32bcf9166a0657b89d2360272f7951387b1923887b00adc83b9df925b5a7f	2026-08-09 00:14:51.829514+05:30	20260808184451_add_challan_customer_snapshot	\N	\N	2026-08-09 00:14:51.806067+05:30	1
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, created_at) FROM stdin;
1	Electronics	2026-08-08 17:38:12.974
2	Furniture	2026-08-08 17:38:12.992
3	Stationery	2026-08-08 17:38:13
4	Hardware	2026-08-08 17:38:13.007
\.


--
-- Data for Name: challan_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.challan_items (id, challan_id, product_id, product_name, sku, unit_price, quantity) FROM stdin;
3	2	1	Wireless Keyboard	KEY001	1200.00	4
4	3	1	Wireless Keyboard	KEY001	120.00	4
\.


--
-- Data for Name: challans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.challans (id, challan_number, customer_id, total_quantity, status, created_by, created_at, updated_at, business_name, customer_address, customer_email, customer_mobile, customer_name, gst_number) FROM stdin;
2	CH-1786251472980	1	4	CONFIRMED	5	2026-08-09 04:57:52.991	2026-08-09 05:02:25.48	ABC Traders	Delhi	rahul11@example.com	9876543210	Rahul Sharma updated	09ABCDE1234F1Z5
3	CH-1786270441316	3	4	CONFIRMED	5	2026-08-09 10:14:01.321	2026-08-09 10:14:39.644	test trader	erighqerifu qoeuiyhferiqgj eqrgiu;qhejf	test@test.com	7004370655	shubham	34y45yg
\.


--
-- Data for Name: customer_followups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_followups (id, customer_id, note, follow_up_date, created_by, created_at) FROM stdin;
4	1	Called customer and discussed the new quotation	2026-08-20 00:00:00	5	2026-08-08 17:43:10.985
5	3	thuis is the test follow up	2026-08-12 00:00:00	5	2026-08-09 07:33:49.011
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customers (id, name, mobile, email, business_name, gst_number, customer_type, address, status, follow_up_date, created_at, updated_at) FROM stdin;
1	Rahul Sharma updated	9876543210	rahul11@example.com	ABC Traders	09ABCDE1234F1Z5	WHOLESALE	Delhi	ACTIVE	2026-08-15 00:00:00	2026-08-08 17:39:38.766	2026-08-08 17:41:27.934
3	shubham	7004370655	test@test.com	test trader	34y45yg	RETAIL	erighqerifu qoeuiyhferiqgj eqrgiu;qhejf	ACTIVE	2026-08-09 00:00:00	2026-08-09 07:32:05.384	2026-08-09 08:30:37.577
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, sku, category_id, unit_price, current_stock, minimum_stock, warehouse_id, created_at, updated_at) FROM stdin;
1	Wireless Keyboard	KEY001	1	120.00	17	10	1	2026-08-08 17:50:21.659	2026-08-09 10:14:39.637
\.


--
-- Data for Name: stock_movements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_movements (id, product_id, quantity, movement_type, reason, created_by, created_at) FROM stdin;
1	1	5	IN	Initial stock received	5	2026-08-08 18:04:28.1
2	1	5	OUT	Initial stock received	5	2026-08-08 18:04:48.465
3	1	5	IN	Initial stock received	5	2026-08-08 18:05:10.383
4	1	4	OUT	Challan CH-1786251472980	5	2026-08-09 05:02:25.443
5	1	20	IN	this is test reason	5	2026-08-09 09:20:14.237
6	1	4	OUT	Challan CH-1786270441316	5	2026-08-09 10:14:39.64
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password_hash, role, created_at, updated_at) FROM stdin;
5	admin user	admin@example.com	$2b$10$UPoC9xzYZaFpTn7aeeuMiuMo6zKAN2LIL9ETO22klcITqSxW7sdzK	ADMIN	2026-08-08 17:38:12.821	2026-08-08 17:38:12.821
6	sales user	sales@example.com	$2b$10$UPoC9xzYZaFpTn7aeeuMiuMo6zKAN2LIL9ETO22klcITqSxW7sdzK	SALES	2026-08-08 17:38:12.951	2026-08-08 17:38:12.951
7	warehouse user	warehouse@example.com	$2b$10$UPoC9xzYZaFpTn7aeeuMiuMo6zKAN2LIL9ETO22klcITqSxW7sdzK	WAREHOUSE	2026-08-08 17:38:12.962	2026-08-08 17:38:12.962
8	accounts user	accounts@example.com	$2b$10$UPoC9xzYZaFpTn7aeeuMiuMo6zKAN2LIL9ETO22klcITqSxW7sdzK	ACCOUNTS	2026-08-08 17:38:12.966	2026-08-08 17:38:12.966
\.


--
-- Data for Name: warehouses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.warehouses (id, name, location, created_at) FROM stdin;
1	Main Warehouse	Delhi	2026-08-08 17:38:13.031
\.


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 5, true);


--
-- Name: challan_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.challan_items_id_seq', 4, true);


--
-- Name: challans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.challans_id_seq', 3, true);


--
-- Name: customer_followups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_followups_id_seq', 5, true);


--
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customers_id_seq', 3, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 1, true);


--
-- Name: stock_movements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_movements_id_seq', 6, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 8, true);


--
-- Name: warehouses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.warehouses_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

\unrestrict FRaikhdKgIFNtvdZnGXPy3QEXlP5RpfezjDWvtApPEpdRH6Ftcu0eddCv4kqPJ0

