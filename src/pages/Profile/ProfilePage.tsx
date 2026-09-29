import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Building2,
  CheckCircle2,
  ImagePlus,
  LockKeyhole,
  Mail,
  Maximize2,
  Minus,
  Plus,
  RotateCcw,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  User,
  UserRound,
} from "lucide-react";

import {
  useUserPreferences,
} from "../../context/UserPreferencesContext";

function ProfilePage() {
  const {
    profile,
    saveProfile,
  } = useUserPreferences();

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const cropImageRef =
    useRef<HTMLImageElement | null>(null);

  const cropFrameRef =
    useRef<HTMLDivElement | null>(null);

  const [fullName, setFullName] =
    useState(profile.fullName);

  const [organization, setOrganization] =
    useState(profile.organization);

  const [photo, setPhoto] =
    useState(profile.photo);

  const [saved, setSaved] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  // Crop editor state
  const [isCropOpen, setIsCropOpen] =
    useState(false);

  const [cropImage, setCropImage] =
    useState("");

  const [zoom, setZoom] =
    useState(1);

  const [position, setPosition] =
    useState({
      x: 0,
      y: 0,
    });

  const [dragging, setDragging] =
    useState(false);

  const [dragStart, setDragStart] =
    useState({
      x: 0,
      y: 0,
    });

  const [imageStart, setImageStart] =
    useState({
      x: 0,
      y: 0,
    });

  const avatarInitial =
    fullName.trim().charAt(0).toUpperCase() ||
    "L";

  /*
   * Keep local form values synchronized
   * if the shared profile changes.
   */
  useEffect(() => {
    setFullName(profile.fullName);
    setOrganization(profile.organization);
    setPhoto(profile.photo);
  }, [
    profile.fullName,
    profile.organization,
    profile.photo,
  ]);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  /*
   * Open the crop editor after selecting
   * an image.
   */
  const handlePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert(
        "Please select a valid image file."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(
        "Please choose an image smaller than 5 MB."
      );

      event.target.value = "";
      return;
    }

    setUploading(true);

    const reader =
      new FileReader();

    reader.onload = () => {
      const result =
        reader.result as string;

      const image =
        new Image();

      image.onload = () => {
        setCropImage(result);

        /*
         * Start with a sensible default zoom.
         */
        setZoom(1);

        /*
         * Center the image initially.
         */
        setPosition({
          x: 0,
          y: 0,
        });

        setUploading(false);
        setIsCropOpen(true);
      };

      image.onerror = () => {
        setUploading(false);

        alert(
          "Unable to read this image."
        );
      };

      image.src = result;
    };

    reader.onerror = () => {
      setUploading(false);

      alert(
        "Unable to upload this image."
      );
    };

    reader.readAsDataURL(file);

    event.target.value = "";
  };

  /*
   * Reset crop position and zoom.
   */
  const handleResetCrop = () => {
    setZoom(1);

    setPosition({
      x: 0,
      y: 0,
    });
  };

  /*
   * Mouse drag start.
   */
  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    event.preventDefault();

    setDragging(true);

    setDragStart({
      x: event.clientX,
      y: event.clientY,
    });

    setImageStart({
      x: position.x,
      y: position.y,
    });

    event.currentTarget.setPointerCapture(
      event.pointerId
    );
  };

  /*
   * Mouse/touch drag movement.
   */
  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (!dragging) {
      return;
    }

    const deltaX =
      event.clientX - dragStart.x;

    const deltaY =
      event.clientY - dragStart.y;

    setPosition({
      x: imageStart.x + deltaX,
      y: imageStart.y + deltaY,
    });
  };

  /*
   * End drag.
   */
  const handlePointerUp = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    setDragging(false);

    try {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    } catch {
      // Pointer capture may already be released.
    }
  };

  /*
   * Generate the final square image.
   *
   * The image is rendered into a 512x512 canvas
   * using the exact zoom and drag position selected
   * by the user.
   */
  const createCroppedImage = (): string | null => {
    if (!cropImageRef.current) {
      return null;
    }

    const image =
      cropImageRef.current;

    const frameSize = 512;

    const canvas =
      document.createElement("canvas");

    canvas.width = frameSize;
    canvas.height = frameSize;

    const context =
      canvas.getContext("2d");

    if (!context) {
      return null;
    }

    context.clearRect(
      0,
      0,
      frameSize,
      frameSize
    );

    /*
     * The browser preview uses a 320px frame.
     * Convert the user's screen position to
     * the 512px output canvas.
     */
    const frameElement =
      cropFrameRef.current;

    const previewSize =
      frameElement?.getBoundingClientRect().width ||
      320;

    const scale =
      frameSize / previewSize;

    const imageWidth =
      image.getBoundingClientRect().width;

    const imageHeight =
      image.getBoundingClientRect().height;

    /*
     * Convert displayed dimensions to
     * output canvas dimensions.
     */
    const outputWidth =
      imageWidth * scale;

    const outputHeight =
      imageHeight * scale;

    const outputX =
      (previewSize / 2 +
        position.x -
        imageWidth / 2) *
      scale;

    const outputY =
      (previewSize / 2 +
        position.y -
        imageHeight / 2) *
      scale;

    context.drawImage(
      image,
      outputX,
      outputY,
      outputWidth,
      outputHeight
    );

    return canvas.toDataURL(
      "image/jpeg",
      0.9
    );
  };

  /*
   * Save crop.
   */
  const handleApplyCrop = () => {
    const croppedImage =
      createCroppedImage();

    if (!croppedImage) {
      alert(
        "Unable to create the cropped image."
      );

      return;
    }

    setPhoto(croppedImage);
    setIsCropOpen(false);
    setCropImage("");
  };

  /*
   * Cancel crop editor.
   */
  const handleCancelCrop = () => {
    setIsCropOpen(false);
    setCropImage("");

    setZoom(1);

    setPosition({
      x: 0,
      y: 0,
    });
  };

  /*
   * Remove photo.
   */
  const handleRemovePhoto = () => {
    setPhoto("");
  };

  /*
   * Save profile.
   */
  const handleSave = () => {
    saveProfile({
      fullName:
        fullName.trim() ||
        "LexAI User",

      organization:
        organization.trim() ||
        "LexAI",

      photo,
    });

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <main className="relative min-h-screen overflow-hidden">

      {/* Ambient background */}

      <div className="pointer-events-none absolute -top-40 left-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="pointer-events-none absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="relative z-10 space-y-8">

        {/* Header */}

        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-xl sm:p-8">

          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.06] via-transparent to-purple-500/[0.05]" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div className="max-w-3xl">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300">
                <UserRound className="h-3.5 w-3.5" />
                Account Workspace
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Profile
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Manage your LexAI profile information,
                organization details, profile photo, and
                account identity.
              </p>

            </div>

            <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <ShieldCheck className="h-5 w-5 text-emerald-300" />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Account Status
                </p>

                <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Active
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* Workspace */}

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.8fr_1.7fr]">

          {/* Identity */}

          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl sm:p-7">

            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.05] via-transparent to-transparent" />

            <div className="relative">

              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                <User className="h-4 w-4 text-cyan-300" />
                Identity
              </div>

              {/* Avatar */}

              <div className="mt-7 flex flex-col items-center text-center">

                <div className="relative">

                  <button
                    type="button"
                    onClick={handlePhotoClick}
                    className="group relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-[2rem] border border-cyan-500/20 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 shadow-2xl shadow-cyan-500/5 transition hover:border-cyan-400/50"
                  >

                    {photo ? (
                      <img
                        src={photo}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-cyan-300">
                        {avatarInitial}
                      </span>
                    )}

                    <span className="absolute inset-0 flex items-center justify-center bg-slate-950/60 opacity-0 transition group-hover:opacity-100">

                      <span className="flex flex-col items-center gap-1 text-white">
                        <ImagePlus className="h-6 w-6" />

                        <span className="text-[10px] font-semibold">
                          Change Photo
                        </span>
                      </span>

                    </span>

                  </button>

                  <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-xl border border-slate-800 bg-slate-950">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </div>

                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />

                <div className="mt-4 flex items-center gap-2">

                  <button
                    type="button"
                    onClick={handlePhotoClick}
                    disabled={uploading}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-cyan-500/40 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Upload className="h-3.5 w-3.5" />

                    {uploading
                      ? "Processing..."
                      : "Upload Photo"}
                  </button>

                  {photo && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  )}

                </div>

                <p className="mt-2 text-[11px] text-slate-600">
                  JPG, PNG or other image • Maximum 5 MB
                </p>

                <h2 className="mt-6 max-w-full truncate text-2xl font-bold text-white">
                  {fullName || "LexAI User"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {profile.role}
                </p>

                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-cyan-500/10 bg-cyan-500/5 px-3 py-1.5 text-xs font-medium text-cyan-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  LexAI Member
                </div>

              </div>

              {/* Details */}

              <div className="mt-8 space-y-3">

                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">

                  <div className="flex items-center gap-3">

                    <Mail className="h-4 w-4 text-slate-500" />

                    <div className="min-w-0">

                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                        Account Email
                      </p>

                      <p className="mt-1 truncate text-sm text-slate-300">
                        {profile.email || "Not available"}
                      </p>

                    </div>

                  </div>

                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">

                  <div className="flex items-center gap-3">

                    <ShieldCheck className="h-4 w-4 text-slate-500" />

                    <div>

                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                        Account Role
                      </p>

                      <p className="mt-1 text-sm text-cyan-300">
                        {profile.role}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">

                <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />

                <p className="text-xs leading-5 text-slate-500">
                  Your profile photo and editable profile
                  information are saved to this LexAI browser
                  session.
                </p>

              </div>

            </div>

          </div>

          {/* Details */}

          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl sm:p-7">

            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.015] via-transparent to-cyan-500/[0.02]" />

            <div className="relative">

              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-6">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Profile Details
                  </p>

                  <h2 className="mt-2 text-xl font-semibold text-white">
                    Personal Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Update the information associated with your
                    LexAI workspace.
                  </p>

                </div>

                <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 sm:flex">
                  <UserRound className="h-5 w-5 text-cyan-300" />
                </div>

              </div>

              <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-2">

                {/* Full Name */}

                <div>

                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
                  >
                    Full Name
                  </label>

                  <div className="relative">

                    <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(event) =>
                        setFullName(
                          event.target.value
                        )
                      }
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition hover:border-slate-600 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10"
                    />

                  </div>

                </div>

                {/* Email */}

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
                  >
                    Email
                  </label>

                  <div className="relative">

                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-700" />

                    <input
                      id="email"
                      type="email"
                      value={profile.email}
                      readOnly
                      className="w-full cursor-not-allowed rounded-2xl border border-slate-800 bg-slate-950/50 py-3.5 pl-11 pr-4 text-sm text-slate-500 outline-none"
                    />

                  </div>

                  <p className="mt-2 text-xs text-slate-600">
                    Email is linked to your LexAI account.
                  </p>

                </div>

                {/* Role */}

                <div>

                  <label
                    htmlFor="role"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
                  >
                    Role
                  </label>

                  <div className="relative">

                    <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-700" />

                    <input
                      id="role"
                      type="text"
                      value={profile.role}
                      readOnly
                      className="w-full cursor-not-allowed rounded-2xl border border-slate-800 bg-slate-950/50 py-3.5 pl-11 pr-4 text-sm text-slate-500 outline-none"
                    />

                  </div>

                  <p className="mt-2 text-xs text-slate-600">
                    Your role is assigned by LexAI.
                  </p>

                </div>

                {/* Organization */}

                <div>

                  <label
                    htmlFor="organization"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
                  >
                    Organization
                  </label>

                  <div className="relative">

                    <Building2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

                    <input
                      id="organization"
                      type="text"
                      value={organization}
                      onChange={(event) =>
                        setOrganization(
                          event.target.value
                        )
                      }
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition hover:border-slate-600 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10"
                    />

                  </div>

                </div>

              </div>

              {/* Account info */}

              <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/50 p-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/70">
                    <LockKeyhole className="h-4 w-4 text-slate-400" />
                  </div>

                  <div>

                    <h3 className="text-sm font-semibold text-white">
                      Account Information
                    </h3>

                    <p className="text-xs text-slate-600">
                      Read-only account details
                    </p>

                  </div>

                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

                  <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">

                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                      Account Email
                    </p>

                    <p className="mt-2 truncate text-sm text-slate-300">
                      {profile.email || "Not available"}
                    </p>

                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">

                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                      Account Role
                    </p>

                    <p className="mt-2 text-sm text-cyan-300">
                      {profile.role}
                    </p>

                  </div>

                </div>

              </div>

              {/* Save */}

              <div className="mt-8 flex flex-col gap-4 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-300">
                    Keep your profile information up to date.
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Photo, name, and organization are saved
                    together.
                  </p>

                </div>

                <div className="flex items-center gap-3">

                  {saved && (
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      Saved successfully
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/10 transition-all hover:-translate-y-0.5 hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* Footer */}

        <section className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/50 p-5 shadow-xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <CheckCircle2 className="h-5 w-5 text-emerald-300" />
            </div>

            <div>

              <p className="text-sm font-semibold text-slate-300">
                Profile workspace active
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Your profile information and photo are ready.
              </p>

            </div>

          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Account connected
          </div>

        </section>

      </div>

      {/* ================================================== */}
      {/* IMAGE CROP / RESIZE MODAL */}
      {/* ================================================== */}

      {isCropOpen && cropImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">

          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
                  Profile Photo
                </p>

                <h2 className="mt-1 text-lg font-semibold text-white">
                  Adjust Your Photo
                </h2>

              </div>

              <button
                type="button"
                onClick={handleCancelCrop}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-950/60 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                aria-label="Close photo editor"
              >
                ×
              </button>

            </div>

            {/* Crop Area */}

            <div className="p-5">

              <div className="flex justify-center">

                <div
                  ref={cropFrameRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  className={`
                    relative
                    h-80
                    w-80
                    touch-none
                    select-none
                    overflow-hidden
                    rounded-[2rem]
                    border-2
                    border-cyan-400/50
                    bg-slate-950
                    shadow-2xl
                    ${
                      dragging
                        ? "cursor-grabbing"
                        : "cursor-grab"
                    }
                  `}
                >

                  {/* Image */}

                  <img
                    ref={cropImageRef}
                    src={cropImage}
                    alt="Crop preview"
                    draggable={false}
                    className="pointer-events-none absolute left-1/2 top-1/2 max-w-none"
                    style={{
                      transform: `
                        translate(
                          calc(-50% + ${position.x}px),
                          calc(-50% + ${position.y}px)
                        )
                        scale(${zoom})
                      `,
                      transformOrigin: "center center",
                    }}
                  />

                  {/* Center guides */}

                  <div className="pointer-events-none absolute inset-0">

                    <div className="absolute left-1/3 top-0 h-full w-px bg-white/10" />

                    <div className="absolute left-2/3 top-0 h-full w-px bg-white/10" />

                    <div className="absolute left-0 top-1/3 h-px w-full bg-white/10" />

                    <div className="absolute left-0 top-2/3 h-px w-full bg-white/10" />

                  </div>

                  {/* Center target */}

                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">

                    <div className="h-24 w-24 rounded-full border border-white/30" />

                  </div>

                  {/* Corners */}

                  <div className="pointer-events-none absolute left-3 top-3 h-5 w-5 border-l-2 border-t-2 border-cyan-300" />

                  <div className="pointer-events-none absolute right-3 top-3 h-5 w-5 border-r-2 border-t-2 border-cyan-300" />

                  <div className="pointer-events-none absolute bottom-3 left-3 h-5 w-5 border-b-2 border-l-2 border-cyan-300" />

                  <div className="pointer-events-none absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-cyan-300" />

                </div>

              </div>

              {/* Instructions */}

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">

                <Maximize2 className="h-3.5 w-3.5" />

                <span>
                  Drag the image to position it inside the frame
                </span>

              </div>

              {/* Zoom */}

              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <Maximize2 className="h-4 w-4 text-cyan-300" />

                    <span className="text-sm font-semibold text-slate-300">
                      Zoom
                    </span>

                  </div>

                  <span className="rounded-lg bg-slate-800 px-2 py-1 text-xs font-semibold text-cyan-300">
                    {Math.round(zoom * 100)}%
                  </span>

                </div>

                <div className="mt-4 flex items-center gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      setZoom((current) =>
                        Math.max(
                          0.5,
                          Number(
                            (
                              current - 0.1
                            ).toFixed(2)
                          )
                        )
                      )
                    }
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-400 transition hover:border-cyan-500/40 hover:text-cyan-300"
                    aria-label="Zoom out"
                  >
                    <Minus className="h-4 w-4" />
                  </button>

                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.01"
                    value={zoom}
                    onChange={(event) =>
                      setZoom(
                        Number(
                          event.target.value
                        )
                      )
                    }
                    className="h-2 flex-1 cursor-pointer accent-cyan-400"
                    aria-label="Zoom image"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setZoom((current) =>
                        Math.min(
                          3,
                          Number(
                            (
                              current + 0.1
                            ).toFixed(2)
                          )
                        )
                      )
                    }
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-400 transition hover:border-cyan-500/40 hover:text-cyan-300"
                    aria-label="Zoom in"
                  >
                    <Plus className="h-4 w-4" />
                  </button>

                </div>

              </div>

              {/* Reset */}

              <button
                type="button"
                onClick={handleResetCrop}
                className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-cyan-300"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset position and zoom
              </button>

              {/* Actions */}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={handleCancelCrop}
                  className="rounded-2xl border border-slate-700 bg-slate-950/70 px-5 py-3 text-sm font-semibold text-slate-400 transition hover:bg-slate-800 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleApplyCrop}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/10 transition hover:bg-cyan-400"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Apply Photo
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}

export default ProfilePage;