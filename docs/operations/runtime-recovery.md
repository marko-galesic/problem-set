# Runtime recovery

The single-instance runtime restores its application containers at boot with
the problem-set-runtime-refresh service. The service runs the checked-in
deployment/refresh-runtime.sh against the image tag stored in
/etc/problem-set-a-minus/image-tag.

## Install or change the desired tag

Run this through SSM on the project instance:

    cd /path/to/problem-set
    sudo deployment/install-runtime-recovery.sh IMAGE_TAG
    sudo systemctl start problem-set-runtime-refresh.service

Verify the service is enabled, then check the API and frontend container tags
with docker ps. Keep the previous tag in ECR until edge smoke checks pass, so
it remains the explicit rollback target.
