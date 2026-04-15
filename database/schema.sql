-- ================================================================
-- Forge It — RAG Package Dictionary (Full Schema)
-- Run this in your Supabase SQL editor to bootstrap the database.
-- This table is the decoupling layer between user-friendly app names
-- and distro-specific package manager names.
-- ================================================================

-- Drop and recreate for clean state (idempotent)
DROP TABLE IF EXISTS package_dictionary;
DROP TABLE IF EXISTS build_history;

-- ----------------------------------------------------------------
-- Core RAG lookup table
-- ----------------------------------------------------------------
CREATE TABLE package_dictionary (
    id          SERIAL PRIMARY KEY,
    distro      VARCHAR(50)  NOT NULL, -- 'arch', 'ubuntu', 'fedora', 'debian'
    app_name    VARCHAR(100) NOT NULL, -- User-facing name: 'vscode', 'steam'
    package_name VARCHAR(100) NOT NULL, -- Exact package manager name
    install_method VARCHAR(20) NOT NULL DEFAULT 'native', -- 'native' | 'flatpak' | 'aur' | 'snap'
    category    VARCHAR(50),           -- 'gaming' | 'development' | 'media' | 'browser'
    size_mb     INTEGER,               -- Approximate install size
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX ON package_dictionary (distro, app_name);

-- ----------------------------------------------------------------
-- Build history — track ISO builds per user
-- ----------------------------------------------------------------
CREATE TABLE build_history (
    id              SERIAL PRIMARY KEY,
    user_id         VARCHAR(100) NOT NULL,
    distro          VARCHAR(50)  NOT NULL,
    github_run_id   BIGINT,
    packages        TEXT,              -- comma-separated final package string
    status          VARCHAR(20) DEFAULT 'queued', -- queued | in_progress | completed | failed
    artifact_url    TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    completed_at    TIMESTAMPTZ
);

-- ----------------------------------------------------------------
-- ARCH LINUX PACKAGES
-- Source of truth: https://archlinux.org/packages/
-- ----------------------------------------------------------------

INSERT INTO package_dictionary (distro, app_name, package_name, install_method, category, size_mb) VALUES
-- Browsers
('arch', 'firefox',       'firefox',           'native',   'browser',     120),
('arch', 'chromium',      'chromium',          'native',   'browser',     250),

-- Development
('arch', 'vscode',        'code',              'native',   'development', 320),
('arch', 'neovim',        'neovim',            'native',   'development', 45),
('arch', 'git',           'git',               'native',   'development', 35),
('arch', 'docker',        'docker',            'native',   'development', 280),
('arch', 'nodejs',        'nodejs',            'native',   'development', 90),
('arch', 'python',        'python',            'native',   'development', 80),
('arch', 'rustup',        'rustup',            'native',   'development', 15),
('arch', 'go',            'go',                'native',   'development', 420),

-- Gaming
('arch', 'steam',         'steam',             'native',   'gaming',      180),
('arch', 'lutris',        'lutris',            'native',   'gaming',      90),
('arch', 'gamemode',      'gamemode',          'native',   'gaming',      5),
('arch', 'mangohud',      'mangohud',          'native',   'gaming',      8),
('arch', 'proton-ge',     'proton-ge-custom',  'aur',      'gaming',      600),

-- GPU Drivers (injected by n8n based on detected GPU)
('arch', 'nvidia-drivers', 'nvidia-dkms',      'native',   'driver',      80),
('arch', 'nvidia-utils',   'nvidia-utils',     'native',   'driver',      60),
('arch', 'amd-drivers',    'mesa',             'native',   'driver',      180),
('arch', 'amd-vulkan',     'vulkan-radeon',    'native',   'driver',      40),

-- Media
('arch', 'obs',           'obs-studio',        'native',   'media',       210),
('arch', 'vlc',           'vlc',               'native',   'media',       80),
('arch', 'blender',       'blender',           'native',   'media',       950),
('arch', 'gimp',          'gimp',              'native',   'media',       220),
('arch', 'kdenlive',      'kdenlive',          'native',   'media',       180),

-- Productivity
('arch', 'discord',       'discord',           'native',   'productivity',150),
('arch', 'slack',         'slack-desktop',     'aur',      'productivity',200),
('arch', 'libreoffice',   'libreoffice-fresh', 'native',   'productivity',400),
('arch', 'keepassxc',     'keepassxc',         'native',   'productivity',45),

-- Desktop Environments
('arch', 'kde',           'plasma',            'native',   'desktop',     820),
('arch', 'gnome',         'gnome',             'native',   'desktop',     750),
('arch', 'hyprland',      'hyprland',          'native',   'desktop',     120),
('arch', 'xfce',          'xfce4',             'native',   'desktop',     450);

-- ----------------------------------------------------------------
-- UBUNTU PACKAGES
-- Source of truth: https://packages.ubuntu.com/
-- ----------------------------------------------------------------

INSERT INTO package_dictionary (distro, app_name, package_name, install_method, category, size_mb) VALUES
-- Browsers
('ubuntu', 'firefox',    'firefox',           'native',   'browser',     120),
('ubuntu', 'chromium',   'chromium-browser',  'native',   'browser',     250),

-- Development
('ubuntu', 'vscode',     'code',              'native',   'development', 320),
('ubuntu', 'neovim',     'neovim',            'native',   'development', 45),
('ubuntu', 'git',        'git',               'native',   'development', 35),
('ubuntu', 'docker',     'docker.io',         'native',   'development', 280),
('ubuntu', 'nodejs',     'nodejs',            'native',   'development', 90),
('ubuntu', 'python',     'python3',           'native',   'development', 80),

-- Gaming
('ubuntu', 'steam',      'steam',             'native',   'gaming',      180),
('ubuntu', 'lutris',     'lutris',            'native',   'gaming',      90),

-- GPU Drivers
('ubuntu', 'nvidia-drivers', 'nvidia-driver-535', 'native', 'driver',   200),

-- Media
('ubuntu', 'obs',        'obs-studio',        'native',   'media',       210),
('ubuntu', 'vlc',        'vlc',               'native',   'media',       80),
('ubuntu', 'blender',    'blender',           'native',   'media',       950),

-- Productivity
('ubuntu', 'discord',    'discord',           'native',   'productivity',150),
('ubuntu', 'libreoffice','libreoffice',       'native',   'productivity',400);

-- ----------------------------------------------------------------
-- FEDORA PACKAGES
-- Source of truth: https://packages.fedoraproject.org/
-- ----------------------------------------------------------------

INSERT INTO package_dictionary (distro, app_name, package_name, install_method, category, size_mb) VALUES
-- Browsers
('fedora', 'firefox',    'firefox',      'native',  'browser',     120),
('fedora', 'chromium',   'chromium',     'native',  'browser',     250),

-- Development
('fedora', 'vscode',     'code',         'native',  'development', 320),
('fedora', 'git',        'git',          'native',  'development', 35),
('fedora', 'docker',     'moby-engine',  'native',  'development', 280),
('fedora', 'nodejs',     'nodejs',       'native',  'development', 90),
('fedora', 'python',     'python3',      'native',  'development', 80),

-- GPU Drivers
('fedora', 'nvidia-drivers', 'akmod-nvidia', 'native', 'driver',  200),

-- Media
('fedora', 'obs',        'obs-studio',   'native',  'media',       210),
('fedora', 'vlc',        'vlc',          'native',  'media',       80),

-- Productivity
('fedora', 'discord',    'discord',      'native',  'productivity',150),
('fedora', 'libreoffice','libreoffice',  'native',  'productivity',400);

-- ----------------------------------------------------------------
-- Row-level Security (Supabase)
-- Enable RLS and expose read-only access to anon key
-- ----------------------------------------------------------------
ALTER TABLE package_dictionary ENABLE ROW LEVEL SECURITY;
ALTER TABLE build_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read-only access to package_dictionary"
  ON package_dictionary FOR SELECT
  USING (true);

CREATE POLICY "Users can read their own builds"
  ON build_history FOR SELECT
  USING (true);  -- Lock this down by userId when auth is implemented

-- ----------------------------------------------------------------
-- Helpful query: Look up packages for a given distro + app list
-- This is what the n8n PostgreSQL node runs.
-- ----------------------------------------------------------------
-- SELECT package_name, install_method
-- FROM package_dictionary
-- WHERE distro = 'arch'
-- AND app_name IN ('vscode', 'steam', 'discord');
