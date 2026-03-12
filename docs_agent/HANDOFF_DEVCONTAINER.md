Document: 08_ESCALATION_AND_HANDOFF
Scope: Dev Container 起動失敗の調査・修正、その後の DNS 検証ツール baseline 反映、およびチャット再開用ハンドオフ
Outcome: Handoff ready
Actions taken: remoteContainers ログを確認し、.devcontainer/Dockerfile で corepack enable が Node feature より先に実行されていたことを原因特定した; .devcontainer/Dockerfile から corepack enable を削除し、.devcontainer/postCreate.sh で node と npm の確認後に corepack enable を実行するよう変更した; 起動時にホストの .gitconfig が存在せず bind mount で失敗していたため、.devcontainer/devcontainer.json に initializeCommand を追加し、.devcontainer/ensure-host-mounts.sh で .aws、.config/gh、.gitconfig を事前作成するようにした; GCP production-equivalent live execution で public DNS 検証に `dig` が必要だったため、`dnsutils` を devcontainer baseline tool として扱い、postCreate の toolchain verification と agent docs にも反映した
Evidence: Dev Containers CLI で build と start が成功した; コンテナ内で node --version が v22.22.1、npm --version が 10.9.4、corepack --version が 0.34.6 を返すことを確認した; `dig -v` が `DiG 9.18.44-1~deb12u1-Debian` を返すことを確認した; 修正対象は .devcontainer/devcontainer.json、.devcontainer/Dockerfile、.devcontainer/postCreate.sh、.devcontainer/ensure-host-mounts.sh
Risks or blockers: .devcontainer/devcontainer.json の typescript.tsdk 設定には既存の非推奨警告が残っているが、今回の起動失敗や DNS 検証ツール反映とは無関係; リポジトリ内には unrelated な削除差分が多数あるため、この件とは切り分けて扱う必要がある
Closure rationale: no chain-closure decision; this record is a handoff for continuation after the dev container startup fix and DNS tool baseline update
Next action: 新しいチャットでこのファイルと .devcontainer/devcontainer.json を開き、このハンドオフを読んだうえで続行する; GCP hostname / certificate 検証が絡む場合は `dig` を first-class tool として使い、reviewer 観点では Dev Container の再起動と Rebuild and Reopen in Container 後に `dig -v` を再確認する; approval owner 観点では不要

# 再開用メモ

次の新規チャットで最初にこう伝えると早いです。

```text
.devcontainer/HANDOFF_DEVCONTAINER.md を読んで、この Dev Container 修正の続きから始めてください。必要なら .devcontainer/devcontainer.json と関連スクリプトも確認してください。
```

# 変更ファイル

- .devcontainer/devcontainer.json
- .devcontainer/Dockerfile
- .devcontainer/postCreate.sh
- .devcontainer/ensure-host-mounts.sh

# 目的別の使い分け

- チャットが消えても引き継ぎたい: このファイルを開いて新チャットに読ませる
- 何を直したかだけ見たい: 上の Execution Record を見る
- 再検証したい: Dev Container を Rebuild and Reopen in Container で開いて postCreate の出力を見る
