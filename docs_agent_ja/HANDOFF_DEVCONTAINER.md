Document: 08_ESCALATION_AND_HANDOFF
Scope: Dev Container の browser-validation baseline 整備、portal-web dependency refresh、rebuild 後の再検証完了
Outcome: Handoff ready
Actions taken: .devcontainer/devcontainer.json に remoteEnv PATH を追加して VS Code 経由の shell/task でも Node.js と npm が安定して見えるようにした; .devcontainer/postCreate.sh で portal-web の npm ci と Playwright Chromium 導入を自動化した; .devcontainer/Dockerfile に Playwright Chromium 実行に必要な Linux 依存ライブラリを追加した; apps/portal-web/package.json と package-lock.json で Vite を 8.0.0 へ更新して audit 対象を解消した; Rebuild and Reopen in Container 後に toolchain、npm audit、SNS contract/browser suite を再検証した
Evidence: Rebuild 後コンテナ内で node --version が v22.22.1、npm --version が 10.9.4、corepack --version が 0.34.6、dig -v が `DiG 9.18.44-1~deb12u1-Debian` を返した; postCreate が portal-web dependencies と Playwright Chromium を導入して完走した; `cd apps/portal-web && npm audit --json` は total 0 vulnerabilities を返した; `npm run typecheck`、`npm run test:sns-request-response-contract`、`npm run test:sns-auth-error-contract`、`npm run test:sns-surface-reachability`、`npm run test:sns-auth-post-readback` がすべて passed で完了した; commit `c238782` (`devcontainer: support portal browser validation`) を main に push した
Risks or blockers: .devcontainer/devcontainer.json の typescript.tsdk 設定には既存の非推奨警告が残っているが、今回の browser-validation baseline とは無関係; 実行中コンテナーの内側から Dev Containers CLI で self-rebuild すると host bind path 解決に失敗する場合があるため、再ビルド確認は VS Code の Rebuild and Reopen in Container を正とする
Next action: 新しいチャットでこのファイルと .devcontainer/devcontainer.json を開いて最新の browser-validation baseline を前提に続行する; portal-web の browser suite を再利用するタスクでは `npm audit` と SNS 4 本の検証コマンドを baseline evidence として扱う; Dev Container 再検証が必要な場合は VS Code から Rebuild and Reopen in Container を使う

# 再開用メモ

次の新規チャットで最初にこう伝えると早いです。

```text
.devcontainer/HANDOFF_DEVCONTAINER.md を読んで、この Dev Container browser-validation baseline の続きから始めてください。必要なら .devcontainer/devcontainer.json、Dockerfile、postCreate.sh、apps/portal-web/package.json を確認してください。
```

# 変更ファイル

- .devcontainer/devcontainer.json
- .devcontainer/Dockerfile
- .devcontainer/postCreate.sh
- apps/portal-web/package.json
- apps/portal-web/package-lock.json

# 目的別の使い分け

- チャットが消えても引き継ぎたい: このファイルを開いて新チャットに読ませる
- 何を直したかだけ見たい: 上の Execution Record を見る
- 再検証したい: Dev Container を Rebuild and Reopen in Container で開き、postCreate と apps/portal-web の SNS 検証一式を流す
