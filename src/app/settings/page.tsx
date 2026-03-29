"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { getSettings, upsertSettings } from "./actions";

const schema = z.object({
  brandName: z.string().optional(),
  industry: z.string().optional(),
  website: z.string().optional(),
  defaultTone: z.string().optional(),
  topicsToAvoid: z.string().optional(),
  emailAlerts: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const TONES = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "witty", label: "Witty" },
  { value: "authoritative", label: "Authoritative" },
];

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, setValue, watch, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      brandName: "",
      industry: "",
      website: "",
      defaultTone: "professional",
      topicsToAvoid: "",
      emailAlerts: false,
    },
  });

  const emailAlerts = watch("emailAlerts");
  const defaultTone = watch("defaultTone");

  useEffect(() => {
    getSettings().then((data) => {
      reset({
        brandName: data.brandName ?? "",
        industry: data.industry ?? "",
        website: data.website ?? "",
        defaultTone: data.defaultTone ?? "professional",
        topicsToAvoid: data.topicsToAvoid ?? "",
        emailAlerts: data.emailAlerts,
      });
      setLoading(false);
    });
  }, [reset]);

  async function onSubmit(values: FormValues) {
    setSaving(true);
    setSaved(false);
    await upsertSettings({
      brandName: values.brandName || null,
      industry: values.industry || null,
      website: values.website || null,
      defaultTone: values.defaultTone || null,
      topicsToAvoid: values.topicsToAvoid || null,
      emailAlerts: values.emailAlerts,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl space-y-6 px-6 py-8">
          <h1 className="text-2xl font-semibold">Settings</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Brand Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="brandName">Brand name</Label>
                  <Input
                    id="brandName"
                    placeholder="Acme Inc."
                    disabled={loading}
                    {...register("brandName")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    placeholder="SaaS, E-commerce, Healthcare…"
                    disabled={loading}
                    {...register("industry")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="https://example.com"
                    disabled={loading}
                    {...register("website")}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Brand Voice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Default tone</Label>
                  <Select
                    value={defaultTone}
                    onValueChange={(v) => setValue("defaultTone", v)}
                    disabled={loading}
                  >
                    <SelectTrigger aria-label="Select tone">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {TONES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topicsToAvoid">Topics to avoid</Label>
                  <Textarea
                    id="topicsToAvoid"
                    placeholder="Politics, competitors, controversial topics…"
                    disabled={loading}
                    {...register("topicsToAvoid")}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailAlerts">Email alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for scheduled post activity
                    </p>
                  </div>
                  <Switch
                    id="emailAlerts"
                    checked={emailAlerts}
                    onCheckedChange={(checked) => setValue("emailAlerts", checked)}
                    disabled={loading}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={saving || loading}>
                {saving ? "Saving…" : "Save settings"}
              </Button>
              {saved && (
                <span className="text-sm text-muted-foreground">Saved successfully</span>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
