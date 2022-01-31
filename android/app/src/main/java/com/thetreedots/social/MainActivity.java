package com.thetreedots.social;

import android.content.Intent;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

  @Override
  protected void onNewIntent(Intent intent) {
    this.setIntent(intent);
    super.onNewIntent(intent);
  }
}
