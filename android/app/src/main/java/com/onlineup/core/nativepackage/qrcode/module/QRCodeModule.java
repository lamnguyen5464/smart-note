package com.onlineup.core.nativepackage.qrcode.module;

import android.Manifest;
import android.content.Intent;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.onlineup.core.nativepackage.qrcode.helper.QRCodeCallbackManager;
import com.onlineup.core.nativepackage.qrcode.view.scanner.QRCodeScannerActivity;
import com.onlineup.core.permission.PermissionConstants;
import com.onlineup.core.permission.PermissionHelper;

public class QRCodeModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "QRCodeModule";

    public QRCodeModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void startScanning(String desc, Promise promise) {
        QRCodeCallbackManager.setScanningPromise(promise);
        Intent intent = new Intent(getCurrentActivity(), QRCodeScannerActivity.class);
        intent.putExtra("desc", desc);
        getCurrentActivity().startActivity(intent);
    }

    @ReactMethod
    public void checkCameraPermission(Promise promise) {
        String result = PermissionHelper.checkPermission(
                getCurrentActivity(),
                Manifest.permission.CAMERA
        );
        if (!result.equals(PermissionConstants.GRANTED)) {
            PermissionHelper.requestPermission(getCurrentActivity(), Manifest.permission.CAMERA, promise);
        } else {
            promise.resolve(result);
        }
    }
}
