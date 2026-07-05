export async function sendDiscordNotification(data: {
  title: string;
  description: string;
  color?: number; // Discord color code (e.g., 0x00ff00 for green)
  url?: string; // Optional URL to the gallery post
  fields?: { name: string; value: string; inline?: boolean }[];
  thumbnailUrl?: string; // Student profile image or result thumbnail
}) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl || webhookUrl.includes("YOUR_WEBHOOK_ID")) {
    console.warn("Discord webhook URL is not configured. Skipping notification.");
    return;
  }

  try {
    const payload = {
      embeds: [
        {
          title: data.title,
          description: data.description,
          color: data.color || 0x3498db, // Default to a nice blue
          url: data.url,
          fields: data.fields,
          thumbnail: data.thumbnailUrl ? { url: data.thumbnailUrl } : undefined,
          timestamp: new Date().toISOString(),
          footer: {
            text: "KoreaBridge AI Evaluation",
            icon_url: "https://koreabridge.vercel.app/logo.png", // Adjust if needed
          },
        },
      ],
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`Failed to send Discord notification: ${response.status} ${response.statusText}`);
    } else {
      console.log("Successfully sent Discord notification.");
    }
  } catch (error) {
    console.error("Error sending Discord notification:", error);
  }
}
