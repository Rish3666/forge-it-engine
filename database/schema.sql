-- Forge It Enterprise: RAG Package Dictionary
-- This table maps user-friendly app names to distro-specific package names.

CREATE TABLE package_dictionary (
    id SERIAL PRIMARY KEY,
    distro VARCHAR(50) NOT NULL,       -- 'arch', 'ubuntu', 'fedora', etc.
    app_name VARCHAR(50) NOT NULL,     -- 'vscode', 'docker', 'spotify'
    package_name VARCHAR(50) NOT NULL, -- 'code', 'docker.io', 'spotify-client'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Example Data: VS Code for multiple distros
INSERT INTO package_dictionary (distro, app_name, package_name) VALUES
('arch', 'vscode', 'code'),
('ubuntu', 'vscode', 'code'),
('fedora', 'vscode', 'code');

-- Example Data: Docker
INSERT INTO package_dictionary (distro, app_name, package_name) VALUES
('arch', 'docker', 'docker'),
('ubuntu', 'docker', 'docker.io'),
('fedora', 'docker', 'moby-engine');
