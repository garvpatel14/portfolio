-- ============================================================
-- Portfolio Database Schema
-- PostgreSQL | Garv Patel Portfolio
-- Run: psql -U postgres -f db/schema.sql
-- ============================================================

-- Create database (run separately if needed)
-- CREATE DATABASE portfolio_db;

-- Connect to portfolio_db before running below
-- \c portfolio_db

-- ─── Projects Table ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(150) NOT NULL,
    description TEXT         NOT NULL,
    long_desc   TEXT,
    tags        TEXT[]       DEFAULT '{}',
    github_url  VARCHAR(500),
    live_url    VARCHAR(500),
    image_class VARCHAR(100) DEFAULT 'project-img-default',
    color_from  VARCHAR(20)  DEFAULT '#065f46',
    color_to    VARCHAR(20)  DEFAULT '#064e3b',
    type        VARCHAR(50)  DEFAULT 'solo',   -- 'solo' | 'group'
    featured    BOOLEAN      DEFAULT FALSE,
    created_at  TIMESTAMPTZ  DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- ─── Skills Table ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skills (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    category      VARCHAR(100) NOT NULL,
    display_order INTEGER      DEFAULT 0
);

-- ─── Contact Messages Table ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(150) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    message    TEXT         NOT NULL,
    read       BOOLEAN      DEFAULT FALSE,
    created_at TIMESTAMPTZ  DEFAULT NOW()
);

-- ─── Seed: Projects ───────────────────────────────────────────────────────────
INSERT INTO projects (title, description, long_desc, tags, github_url, live_url, image_class, color_from, color_to, type, featured)
VALUES
(
    'Agricare',
    'A collaborative precision agriculture platform featuring AI-driven crop disease detection, real-time weather integration, and smart market insights for sustainable farming.',
    'Agricare is a full-stack PHP/MySQL web application built as a team project. I contributed the AI disease detection module using Python and the Gemini API, the interactive crop calendar, admin dashboard analytics, and the farmer profile system. The platform helps farmers make data-driven decisions using machine learning.',
    ARRAY['AI', 'Python', 'PHP', 'MySQL', 'Gemini API'],
    'https://github.com/Nilay-Patel-5/Agricare',
    NULL,
    'agricare-img',
    '#065f46',
    '#064e3b',
    'group',
    TRUE
),
(
    'Vehicle Rental System',
    'A full-stack vehicle rental platform featuring real-time geofencing, secure KYC document verification, automated invoice generation, and live fleet tracking.',
    'Built with Python, Supabase (PostgreSQL), and a web frontend, this system handles the entire rental lifecycle — from vehicle listing and booking to real-time GPS geofencing alerts and automated PDF invoice generation. Secure multi-role access (admin/customer) with complete KYC verification flow.',
    ARRAY['Python', 'Supabase', 'PostgreSQL', 'Geofencing', 'KYC'],
    'https://github.com/garvpatel14/Vehicle-Rental',
    NULL,
    'vehicle-img',
    '#1e3a8a',
    '#172554',
    'solo',
    TRUE
),
(
    'Cadet Dossier Management System',
    'A comprehensive military cadet records system with inventory tracking, administrative oversight, and secure multi-role access control.',
    'Designed for the NCC, this PHP/PostgreSQL system manages cadet personal dossiers, uniform inventory, training records, and performance evaluations. Features a secure admin panel with role-based access (Officer, Cadet, Clerk) and generates official reports in PDF format.',
    ARRAY['PHP', 'PostgreSQL', 'Military Tech', 'RBAC'],
    'https://github.com/garvpatel14/Cadet-Dossier-Management-System',
    NULL,
    'cadet-img',
    '#374151',
    '#111827',
    'solo',
    TRUE
)
ON CONFLICT DO NOTHING;

-- ─── Seed: Skills ─────────────────────────────────────────────────────────────
INSERT INTO skills (name, category, display_order) VALUES
    ('Python',       'Languages', 1),
    ('PHP',          'Languages', 2),
    ('JavaScript',   'Languages', 3),
    ('Java',         'Languages', 4),
    ('C++',          'Languages', 5),
    ('HTML5/CSS3',   'Languages', 6),
    ('Node.js',      'Backend & Databases', 1),
    ('Express.js',   'Backend & Databases', 2),
    ('PostgreSQL',   'Backend & Databases', 3),
    ('MySQL',        'Backend & Databases', 4),
    ('Supabase',     'Backend & Databases', 5),
    ('MongoDB',      'Backend & Databases', 6),
    ('AI Integration',     'Specializations', 1),
    ('Real-time Tracking', 'Specializations', 2),
    ('REST APIs',          'Specializations', 3),
    ('Geofencing',         'Specializations', 4),
    ('Docker',             'Tools & DevOps',  1),
    ('Git & GitHub',       'Tools & DevOps',  2),
    ('Vercel',             'Tools & DevOps',  3),
    ('Linux/Bash',         'Tools & DevOps',  4)
ON CONFLICT DO NOTHING;

-- ─── Trigger: auto-update updated_at ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON projects;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
