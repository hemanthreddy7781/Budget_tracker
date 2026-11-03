-- Run once against the existing Ledgr database before starting the updated API.
-- Back up your database first. Existing records are assigned to a disabled legacy owner;
-- newly registered users receive their own categories/groups/settings and start with no transactions.
USE ledgr;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO users (id,name,email,password_hash)
VALUES (1,'Legacy data','legacy@local.invalid','!DISABLED_LEGACY_ACCOUNT!');

ALTER TABLE settings ADD COLUMN IF NOT EXISTS user_id BIGINT UNSIGNED NULL;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS user_id BIGINT UNSIGNED NULL;
ALTER TABLE account_groups ADD COLUMN IF NOT EXISTS user_id BIGINT UNSIGNED NULL;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS user_id BIGINT UNSIGNED NULL;
ALTER TABLE budget_defaults ADD COLUMN IF NOT EXISTS user_id BIGINT UNSIGNED NULL;
ALTER TABLE budget_overrides ADD COLUMN IF NOT EXISTS user_id BIGINT UNSIGNED NULL;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS user_id BIGINT UNSIGNED NULL;

UPDATE settings SET user_id=1 WHERE user_id IS NULL;
UPDATE categories SET user_id=1 WHERE user_id IS NULL;
UPDATE account_groups SET user_id=1 WHERE user_id IS NULL;
UPDATE accounts SET user_id=1 WHERE user_id IS NULL;
UPDATE budget_defaults SET user_id=1 WHERE user_id IS NULL;
UPDATE budget_overrides SET user_id=1 WHERE user_id IS NULL;
UPDATE transactions SET user_id=1 WHERE user_id IS NULL;

ALTER TABLE settings MODIFY user_id BIGINT UNSIGNED NOT NULL;
ALTER TABLE categories MODIFY user_id BIGINT UNSIGNED NOT NULL;
ALTER TABLE account_groups MODIFY user_id BIGINT UNSIGNED NOT NULL;
ALTER TABLE accounts MODIFY user_id BIGINT UNSIGNED NOT NULL;
ALTER TABLE budget_defaults MODIFY user_id BIGINT UNSIGNED NOT NULL;
ALTER TABLE budget_overrides MODIFY user_id BIGINT UNSIGNED NOT NULL;
ALTER TABLE transactions MODIFY user_id BIGINT UNSIGNED NOT NULL;

ALTER TABLE settings ADD CONSTRAINT fk_settings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE categories ADD CONSTRAINT fk_categories_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE account_groups ADD CONSTRAINT fk_groups_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE accounts ADD CONSTRAINT fk_accounts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE budget_defaults ADD CONSTRAINT fk_bdefaults_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE budget_overrides ADD CONSTRAINT fk_boverrides_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE transactions ADD CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE settings ADD UNIQUE KEY uq_settings_user (user_id);
ALTER TABLE categories DROP INDEX uq_name_type;
ALTER TABLE categories ADD UNIQUE KEY uq_category_user_name_type (user_id,name,type);
ALTER TABLE budget_defaults DROP INDEX uq_cat_start;
ALTER TABLE budget_defaults ADD UNIQUE KEY uq_bdef_user_cat_start (user_id,category_id,start_year,start_month);
ALTER TABLE budget_overrides DROP INDEX uq_cat_ym;
ALTER TABLE budget_overrides ADD UNIQUE KEY uq_bover_user_cat_ym (user_id,category_id,year,month);

CREATE INDEX idx_tx_user_date ON transactions(user_id,tx_date);
CREATE INDEX idx_accounts_user ON accounts(user_id);
