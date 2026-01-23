# SQL Challenge Set (PostgreSQL)

This document defines five easy SQL challenges that cover projection, string concatenation, left join, aggregation, and simple reporting across tables. Each challenge includes a minimal schema, small sample data, a prompt, an example expected output, and a closest LeetCode SQL mapping.

## Challenge 1: Projection + Filter

**Skill focus:** projection, filtering, ordering

**Schema (DDL):**
```sql
CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  hire_date DATE NOT NULL,
  department_id INTEGER
);
```

**Sample data:**
```sql
INSERT INTO employees (id, name, hire_date, department_id) VALUES
  (1, 'Avery Diaz', '2019-03-12', 10),
  (2, 'Bryn Lee', '2021-01-20', 20),
  (3, 'Carmen Fox', '2022-07-01', 10),
  (4, 'Dev Patel', '2020-02-05', 30);
```

**Prompt:**  
Return the `id` and `name` of employees hired after `2020-12-31`, ordered by `name` ascending.

**Expected output (from sample data):**
```
 id |    name
----+-------------
  2 | Bryn Lee
  3 | Carmen Fox
```

**Closest LC SQL:** Recyclable and Low Fat Products (projection + filter pattern)

---

## Challenge 2: String Concatenation

**Skill focus:** string concatenation using `||`

**Schema (DDL):**
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL
);
```

**Sample data:**
```sql
INSERT INTO users (id, first_name, last_name) VALUES
  (1, 'Ava', 'Chen'),
  (2, 'Luis', 'Garcia'),
  (3, 'Mira', 'Ibrahim');
```

**Prompt:**  
Return `id` and a `full_name` column that concatenates `first_name` + space + `last_name`.

**Expected output (from sample data):**
```
 id |   full_name
----+-------------
  1 | Ava Chen
  2 | Luis Garcia
  3 | Mira Ibrahim
```

**Closest LC SQL:** Fix Names in a Table / Combine Two Tables (output formatting pattern)

---

## Challenge 3: Left Join (Preserve Left)

**Skill focus:** left join, NULL handling

**Schema (DDL):**
```sql
CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  created_at DATE NOT NULL
);
```

**Sample data:**
```sql
INSERT INTO customers (id, name) VALUES
  (1, 'Northwind Cafe'),
  (2, 'Bluebird Bikes'),
  (3, 'Harbor Market');

INSERT INTO orders (id, customer_id, total, created_at) VALUES
  (10, 1, 45.00, '2023-05-01'),
  (11, 1, 28.50, '2023-05-14'),
  (12, 2, 75.25, '2023-05-20');
```

**Prompt:**  
List all customers and their latest order total. If a customer has no orders, show `NULL` for the total. Return columns: `customer_name`, `latest_total`.

**Expected output (from sample data):**
```
  customer_name  | latest_total
-----------------+-------------
 Bluebird Bikes  |       75.25
 Harbor Market   |        NULL
 Northwind Cafe  |       28.50
```

**Closest LC SQL:** Customers Who Never Order (left join + NULL pattern)

---

## Challenge 4: Aggregation

**Skill focus:** GROUP BY, HAVING

**Schema (DDL):**
```sql
CREATE TABLE classes (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE enrollments (
  id INTEGER PRIMARY KEY,
  class_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL
);
```

**Sample data:**
```sql
INSERT INTO classes (id, name) VALUES
  (1, 'Biology'),
  (2, 'Calculus'),
  (3, 'History');

INSERT INTO enrollments (id, class_id, student_id) VALUES
  (1, 1, 100),
  (2, 1, 101),
  (3, 1, 102),
  (4, 2, 103),
  (5, 2, 104);
```

**Prompt:**  
List classes with at least 3 students enrolled. Return columns: `class_name`, `student_count`.

**Expected output (from sample data):**
```
 class_name | student_count
------------+---------------
 Biology    |             3
```

**Closest LC SQL:** Classes More Than 5 Students (group + HAVING pattern)

---

## Challenge 5: Simple Reporting Across Tables

**Skill focus:** join + aggregation

**Schema (DDL):**
```sql
CREATE TABLE departments (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  department_id INTEGER NOT NULL,
  salary INTEGER NOT NULL
);
```

**Sample data:**
```sql
INSERT INTO departments (id, name) VALUES
  (10, 'Engineering'),
  (20, 'Sales'),
  (30, 'Support');

INSERT INTO employees (id, department_id, salary) VALUES
  (1, 10, 120000),
  (2, 10, 110000),
  (3, 20, 90000);
```

**Prompt:**  
For each department, show the department name, employee count, and total salary. Include departments with zero employees.

**Expected output (from sample data):**
```
 department_name | employee_count | total_salary
-----------------+----------------+-------------
 Engineering     |              2 |      230000
 Sales           |              1 |       90000
 Support         |              0 |        NULL
```

**Closest LC SQL:** Department Highest Salary (join + aggregate pattern)
