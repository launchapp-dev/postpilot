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
import { Badge } from "@/components/ui/badge";
import { getSettings, upsertSettings } from "./actions";
import {
  getBrandVoices,
  upsertBrandVoice,
  deleteBrandVoice,
  testBrandVoice,
  type BrandVoiceRow,
} from "./brand-voice-actions";

const settingsSchema = z.object({
  brandName: z.string().optional(),
  industry: z.string().optional(),
  website: z.string().optional(),
  emailAlerts: z.boolean(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const voiceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  tone: z.enum(["professional", "casual", "witty", "authoritative"]),
  vocabulary: z.string().optional(),
  topicsToAvoid: z.string().optional(),
  referenceContent: z.string().optional(),
  isDefault: z.boolean(),
});

type VoiceFormValues = z.infer<typeof voiceSchema>;

const TONES = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "witty", label: "Witty" },
  { value: "authoritative", label: "Authoritative" },
];

function VoiceForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: BrandVoiceRow;
  onSave: (voice: BrandVoiceRow) => void;
  onCancel: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<VoiceFormValues>({
    resolver: zodResolver(voiceSchema),
    defaultValues: {
      name: initial?.name ?? "",
      tone: initial?.tone ?? "professional",
      vocabulary: initial?.vocabulary ?? "",
      topicsToAvoid: initial?.topicsToAvoid ?? "",
      referenceContent: initial?.referenceContent ?? "",
      isDefault: initial?.isDefault ?? false,
    },
  });

  const tone = watch("tone");
  const isDefault = watch("isDefault");

  async function onSubmit(values: VoiceFormValues) {
    setSaving(true);
    const saved = await upsertBrandVoice({
      id: initial?.id,
      name: values.name,
      tone: values.tone,
      vocabulary: values.vocabulary || null,
      topicsToAvoid: values.topicsToAvoid || null,
      referenceContent: values.referenceContent || null,
      isDefault: values.isDefault,
    });
    setSaving(false);
    onSave(saved);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label htmlFor="voice-name">Name</Label>
        <Input id="voice-name" placeholder="Main Brand" {...register("name")} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label>Tone</Label>
        <Select value={tone} onValueChange={(v) => setValue("tone", v as VoiceFormValues["tone"])}>
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
        <Label htmlFor="voice-vocabulary">Vocabulary</Label>
        <Textarea
          id="voice-vocabulary"
          placeholder="Keywords and phrases to use…"
          {...register("vocabulary")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="voice-topics">Topics to avoid</Label>
        <Textarea
          id="voice-topics"
          placeholder="Politics, competitors, controversial topics…"
          {...register("topicsToAvoid")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="voice-reference">Reference content</Label>
        <Textarea
          id="voice-reference"
          placeholder="Paste blog posts, guidelines, or example content…"
          rows={4}
          {...register("referenceContent")}
        />
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="voice-default"
          checked={isDefault}
          onCheckedChange={(checked) => setValue("isDefault", checked)}
        />
        <Label htmlFor="voice-default">Set as default voice</Label>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : initial ? "Update voice" : "Create voice"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function VoiceCard({
  voice,
  onEdit,
  onDelete,
  onTestResult,
}: {
  voice: BrandVoiceRow;
  onEdit: () => void;
  onDelete: () => void;
  onTestResult: (voiceId: string, result: string) => void;
}) {
  const [testing, setTesting] = useState(false);

  async function handleTest() {
    setTesting(true);
    const result = await testBrandVoice(voice.id);
    setTesting(false);
    onTestResult(voice.id, result);
  }

  return (
    <div className="flex items-center justify-between rounded-lg border px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="font-medium text-sm">{voice.name}</span>
        <Badge variant="secondary">{voice.tone}</Badge>
        {voice.isDefault && <Badge>Default</Badge>}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleTest} disabled={testing}>
          {testing ? "Testing…" : "Test voice"}
        </Button>
        <Button variant="outline" size="sm" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="outline" size="sm" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [voices, setVoices] = useState<BrandVoiceRow[]>([]);
  const [showVoiceForm, setShowVoiceForm] = useState(false);
  const [editingVoice, setEditingVoice] = useState<BrandVoiceRow | undefined>();
  const [testPreviews, setTestPreviews] = useState<Record<string, string>>({});

  const { register, handleSubmit, setValue, watch, reset } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      brandName: "",
      industry: "",
      website: "",
      emailAlerts: false,
    },
  });

  const emailAlerts = watch("emailAlerts");

  useEffect(() => {
    Promise.all([getSettings(), getBrandVoices()]).then(([data, voiceList]) => {
      reset({
        brandName: data.brandName ?? "",
        industry: data.industry ?? "",
        website: data.website ?? "",
        emailAlerts: data.emailAlerts,
      });
      setVoices(voiceList);
      setLoading(false);
    });
  }, [reset]);

  async function onSubmit(values: SettingsFormValues) {
    setSaving(true);
    setSaved(false);
    await upsertSettings({
      brandName: values.brandName || null,
      industry: values.industry || null,
      website: values.website || null,
      defaultTone: null,
      topicsToAvoid: null,
      emailAlerts: values.emailAlerts,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleVoiceSaved(voice: BrandVoiceRow) {
    setVoices((prev) => {
      const updated = prev.filter((v) => v.id !== voice.id);
      if (voice.isDefault) {
        return [...updated.map((v) => ({ ...v, isDefault: false })), voice].sort(
          (a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0) || a.name.localeCompare(b.name)
        );
      }
      return [...updated, voice].sort(
        (a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0) || a.name.localeCompare(b.name)
      );
    });
    setShowVoiceForm(false);
    setEditingVoice(undefined);
  }

  async function handleDeleteVoice(id: string) {
    await deleteBrandVoice(id);
    setVoices((prev) => prev.filter((v) => v.id !== id));
    setTestPreviews((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function handleEditVoice(voice: BrandVoiceRow) {
    setEditingVoice(voice);
    setShowVoiceForm(true);
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

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Brand Voices</CardTitle>
                {!showVoiceForm && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingVoice(undefined);
                      setShowVoiceForm(true);
                    }}
                  >
                    New voice
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading…</p>
              ) : voices.length === 0 && !showVoiceForm ? (
                <p className="text-sm text-muted-foreground">
                  No brand voices yet. Create one to get started.
                </p>
              ) : null}

              {voices.map((voice) => (
                <div key={voice.id}>
                  {editingVoice?.id === voice.id && showVoiceForm ? (
                    <div className="rounded-lg border px-4 py-3">
                      <p className="text-sm font-medium mb-2">Editing: {voice.name}</p>
                      <VoiceForm
                        initial={editingVoice}
                        onSave={handleVoiceSaved}
                        onCancel={() => {
                          setShowVoiceForm(false);
                          setEditingVoice(undefined);
                        }}
                      />
                    </div>
                  ) : (
                    <>
                      <VoiceCard
                        voice={voice}
                        onEdit={() => handleEditVoice(voice)}
                        onDelete={() => handleDeleteVoice(voice.id)}
                        onTestResult={(id, result) =>
                          setTestPreviews((prev) => ({ ...prev, [id]: result }))
                        }
                      />
                      {testPreviews[voice.id] && (
                        <div className="mt-2 rounded-lg border bg-muted/40 px-4 py-3">
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            Test preview — {voice.name}
                          </p>
                          <p className="text-sm whitespace-pre-wrap">{testPreviews[voice.id]}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}

              {showVoiceForm && !editingVoice && (
                <div className="rounded-lg border px-4 py-3">
                  <p className="text-sm font-medium mb-2">New brand voice</p>
                  <VoiceForm
                    onSave={handleVoiceSaved}
                    onCancel={() => setShowVoiceForm(false)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
