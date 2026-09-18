// Landmark indices according to MediaPipe Pose model
export const POSE_LANDMARKS = {
  NOSE: 0,
  LEFT_EYE_INNER: 1,
  LEFT_EYE: 2,
  LEFT_EYE_OUTER: 3,
  RIGHT_EYE_INNER: 4,
  RIGHT_EYE: 5,
  RIGHT_EYE_OUTER: 6,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  MOUTH_LEFT: 9,
  MOUTH_RIGHT: 10,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_PINKY: 17,
  RIGHT_PINKY: 18,
  LEFT_INDEX: 19,
  RIGHT_INDEX: 20,
  LEFT_THUMB: 21,
  RIGHT_THUMB: 22,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32,
};

export interface Landmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

/**
 * Calculates angle between 3 points (A, B, C) where B is the vertex
 * Returns degrees [0, 180]
 */
export function calculateAngle(a: Landmark, b: Landmark, c: Landmark): number {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) {
    angle = 360.0 - angle;
  }
  return Math.round(angle);
}

export type ExerciseType = 'squats' | 'pushups' | 'bicep_curls' | 'lunges' | 'shoulder_press';

export interface ExerciseAnalysisResult {
  exercise: ExerciseType;
  primaryAngle: number;
  secondaryAngle?: number;
  stage: 'up' | 'down' | 'neutral';
  repCompleted: boolean;
  formQuality: 'Good' | 'Acceptable' | 'Needs Improvement';
  formScore: number;
  feedbackText: string;
  romPercentage: number;
}

export class ExerciseTracker {
  private exercise: ExerciseType;
  private stage: 'up' | 'down' | 'neutral' = 'neutral';
  private repCount: number = 0;
  private formScores: number[] = [];
  private romScores: number[] = [];
  private feedbackHistory: string[] = [];
  private lastRepTimestamp: number = 0;

  constructor(exercise: ExerciseType) {
    this.exercise = exercise;
  }

  public setExercise(exercise: ExerciseType) {
    this.exercise = exercise;
    this.stage = 'neutral';
    this.repCount = 0;
    this.formScores = [];
    this.romScores = [];
    this.feedbackHistory = [];
  }

  public getRepCount(): number {
    return this.repCount;
  }

  public getAverageFormScore(): number {
    if (this.formScores.length === 0) return 88;
    const sum = this.formScores.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.formScores.length);
  }

  public getFeedbackHistory(): string[] {
    return this.feedbackHistory.slice(-5);
  }

  public analyzeFrame(landmarks: Landmark[]): ExerciseAnalysisResult {
    let repCompleted = false;
    let primaryAngle = 0;
    let secondaryAngle: number | undefined;
    let formQuality: 'Good' | 'Acceptable' | 'Needs Improvement' = 'Good';
    let formScore = 90;
    let feedbackText = 'Form looks good. Maintain smooth tempo.';
    let romPercentage = 0;

    if (!landmarks || landmarks.length < 33) {
      return {
        exercise: this.exercise,
        primaryAngle: 0,
        stage: this.stage,
        repCompleted: false,
        formQuality: 'Needs Improvement',
        formScore: 0,
        feedbackText: 'Position your entire body inside camera view.',
        romPercentage: 0,
      };
    }

    const now = Date.now();

    switch (this.exercise) {
      case 'squats': {
        // Track Knee Angle: Hip -> Knee -> Ankle (use left or right depending on visibility)
        const leftHip = landmarks[POSE_LANDMARKS.LEFT_HIP];
        const leftKnee = landmarks[POSE_LANDMARKS.LEFT_KNEE];
        const leftAnkle = landmarks[POSE_LANDMARKS.LEFT_ANKLE];
        const leftShoulder = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];

        primaryAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
        // Back tilt angle: Shoulder -> Hip -> Knee
        secondaryAngle = calculateAngle(leftShoulder, leftHip, leftKnee);

        // Range of motion calculation (standing = 170deg, deep squat = 90deg)
        romPercentage = Math.min(100, Math.max(0, Math.round(((170 - primaryAngle) / (170 - 90)) * 100)));

        if (primaryAngle > 160) {
          if (this.stage === 'down') {
            if (now - this.lastRepTimestamp > 800) {
              this.repCount++;
              repCompleted = true;
              this.lastRepTimestamp = now;
              this.formScores.push(formScore);
            }
          }
          this.stage = 'up';
          feedbackText = 'Standing position. Brace core and begin descent.';
        } else if (primaryAngle < 105) {
          this.stage = 'down';
          if (primaryAngle <= 92) {
            formQuality = 'Good';
            formScore = 95;
            feedbackText = 'Excellent depth! Hips parallel to knees. Drive up through heels.';
          } else {
            formQuality = 'Acceptable';
            formScore = 78;
            feedbackText = 'Drop slightly lower for full range of motion.';
          }

          // Check excessive forward lean
          if (secondaryAngle && secondaryAngle < 55) {
            formQuality = 'Needs Improvement';
            formScore = 65;
            feedbackText = 'Keep chest upright. Avoid excessive forward trunk lean.';
          }
        } else {
          feedbackText = 'Squatting down smoothly with knees tracking toes.';
        }
        break;
      }

      case 'pushups': {
        // Track Elbow Angle: Shoulder -> Elbow -> Wrist
        const leftShoulder = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
        const leftElbow = landmarks[POSE_LANDMARKS.LEFT_ELBOW];
        const leftWrist = landmarks[POSE_LANDMARKS.LEFT_WRIST];
        const leftHip = landmarks[POSE_LANDMARKS.LEFT_HIP];
        const leftAnkle = landmarks[POSE_LANDMARKS.LEFT_ANKLE];

        primaryAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
        // Core alignment: Shoulder -> Hip -> Ankle
        secondaryAngle = calculateAngle(leftShoulder, leftHip, leftAnkle);

        romPercentage = Math.min(100, Math.max(0, Math.round(((165 - primaryAngle) / (165 - 85)) * 100)));

        if (primaryAngle > 155) {
          if (this.stage === 'down') {
            if (now - this.lastRepTimestamp > 750) {
              this.repCount++;
              repCompleted = true;
              this.lastRepTimestamp = now;
              this.formScores.push(formScore);
            }
          }
          this.stage = 'up';
          feedbackText = 'Top plank position. Core engaged.';
        } else if (primaryAngle < 95) {
          this.stage = 'down';
          if (primaryAngle <= 88) {
            formQuality = 'Good';
            formScore = 94;
            feedbackText = 'Great chest depth! Push the floor away.';
          } else {
            formQuality = 'Acceptable';
            formScore = 80;
            feedbackText = 'Descend an inch lower for full chest engagement.';
          }

          // Check hip sagging
          if (secondaryAngle && secondaryAngle < 150) {
            formQuality = 'Needs Improvement';
            formScore = 60;
            feedbackText = 'Hips are sagging! Squeeze glutes to protect lower back.';
          }
        } else {
          feedbackText = 'Elbows tucked at ~45-degree angle to torso.';
        }
        break;
      }

      case 'bicep_curls': {
        // Track Elbow Angle: Shoulder -> Elbow -> Wrist
        const shoulder = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
        const elbow = landmarks[POSE_LANDMARKS.RIGHT_ELBOW];
        const wrist = landmarks[POSE_LANDMARKS.RIGHT_WRIST];

        primaryAngle = calculateAngle(shoulder, elbow, wrist);
        romPercentage = Math.min(100, Math.max(0, Math.round(((160 - primaryAngle) / (160 - 45)) * 100)));

        if (primaryAngle > 145) {
          if (this.stage === 'down') {
            // Started curl from down
          }
          this.stage = 'down';
          feedbackText = 'Arm fully extended. Squeeze bicep on next rep.';
        } else if (primaryAngle < 55) {
          if (this.stage === 'down') {
            if (now - this.lastRepTimestamp > 700) {
              this.repCount++;
              repCompleted = true;
              this.lastRepTimestamp = now;
              this.formScores.push(formScore);
            }
            this.stage = 'up';
          }
          formQuality = 'Good';
          formScore = 92;
          feedbackText = 'Peak bicep contraction! Lower with controlled eccentric tempo.';
        } else {
          feedbackText = 'Keep elbow pinned to ribcage without swinging momentum.';
        }
        break;
      }

      case 'lunges': {
        // Track Front Knee Angle
        const hip = landmarks[POSE_LANDMARKS.LEFT_HIP];
        const knee = landmarks[POSE_LANDMARKS.LEFT_KNEE];
        const ankle = landmarks[POSE_LANDMARKS.LEFT_ANKLE];

        primaryAngle = calculateAngle(hip, knee, ankle);
        romPercentage = Math.min(100, Math.max(0, Math.round(((165 - primaryAngle) / (165 - 90)) * 100)));

        if (primaryAngle > 155) {
          if (this.stage === 'down') {
            if (now - this.lastRepTimestamp > 800) {
              this.repCount++;
              repCompleted = true;
              this.lastRepTimestamp = now;
              this.formScores.push(formScore);
            }
          }
          this.stage = 'up';
          feedbackText = 'Standing tall. Step forward and lower back knee.';
        } else if (primaryAngle < 100) {
          this.stage = 'down';
          if (primaryAngle <= 92) {
            formQuality = 'Good';
            formScore = 92;
            feedbackText = 'Clean 90-degree bend. Push back through front heel.';
          } else {
            formQuality = 'Acceptable';
            formScore = 80;
            feedbackText = 'Lower rear knee towards floor for full engagement.';
          }
        }
        break;
      }

      case 'shoulder_press': {
        // Track Shoulder to Elbow angle
        const shoulder = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
        const elbow = landmarks[POSE_LANDMARKS.RIGHT_ELBOW];
        const wrist = landmarks[POSE_LANDMARKS.RIGHT_WRIST];

        primaryAngle = calculateAngle(shoulder, elbow, wrist);
        romPercentage = Math.min(100, Math.max(0, Math.round(((primaryAngle - 80) / (170 - 80)) * 100)));

        if (primaryAngle > 158) {
          if (this.stage === 'down') {
            if (now - this.lastRepTimestamp > 750) {
              this.repCount++;
              repCompleted = true;
              this.lastRepTimestamp = now;
              this.formScores.push(formScore);
            }
          }
          this.stage = 'up';
          formQuality = 'Good';
          formScore = 94;
          feedbackText = 'Overhead lockout complete. Lower weights under control.';
        } else if (primaryAngle < 90) {
          this.stage = 'down';
          feedbackText = 'Rack position at shoulder level. Press straight up.';
        }
        break;
      }
    }

    if (repCompleted && !this.feedbackHistory.includes(feedbackText)) {
      this.feedbackHistory.push(feedbackText);
    }

    return {
      exercise: this.exercise,
      primaryAngle,
      secondaryAngle,
      stage: this.stage,
      repCompleted,
      formQuality,
      formScore,
      feedbackText,
      romPercentage,
    };
  }
}

/**
 * Draws skeletons on canvas
 */
export function drawPoseSkeleton(
  ctx: CanvasRenderingContext2D,
  landmarks: Landmark[],
  width: number,
  height: number,
  primaryColor: string = '#00F0FF'
) {
  if (!landmarks || landmarks.length === 0) return;

  const connections = [
    // Torso
    [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.RIGHT_SHOULDER],
    [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_HIP],
    [POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_HIP],
    [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.RIGHT_HIP],
    // Left Arm
    [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_ELBOW],
    [POSE_LANDMARKS.LEFT_ELBOW, POSE_LANDMARKS.LEFT_WRIST],
    // Right Arm
    [POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_ELBOW],
    [POSE_LANDMARKS.RIGHT_ELBOW, POSE_LANDMARKS.RIGHT_WRIST],
    // Left Leg
    [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.LEFT_KNEE],
    [POSE_LANDMARKS.LEFT_KNEE, POSE_LANDMARKS.LEFT_ANKLE],
    // Right Leg
    [POSE_LANDMARKS.RIGHT_HIP, POSE_LANDMARKS.RIGHT_KNEE],
    [POSE_LANDMARKS.RIGHT_KNEE, POSE_LANDMARKS.RIGHT_ANKLE],
  ];

  ctx.lineWidth = 4;
  ctx.strokeStyle = primaryColor;
  ctx.lineCap = 'round';

  for (const [startIndex, endIndex] of connections) {
    const start = landmarks[startIndex];
    const end = landmarks[endIndex];
    if (start && end && (start.visibility ?? 1) > 0.4 && (end.visibility ?? 1) > 0.4) {
      ctx.beginPath();
      ctx.moveTo(start.x * width, start.y * height);
      ctx.lineTo(end.x * width, end.y * height);
      ctx.stroke();
    }
  }

  // Draw landmark points
  for (let i = 0; i < landmarks.length; i++) {
    const pt = landmarks[i];
    if (pt && (pt.visibility ?? 1) > 0.4) {
      ctx.beginPath();
      ctx.arc(pt.x * width, pt.y * height, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#10B981'; // vibrant neon green
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();
    }
  }
}

/**
 * Audio cue synthesizer for reps and alerts
 */
export class WorkoutAudioCues {
  private static audioCtx: AudioContext | null = null;

  private static getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public static playRepDing() {
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // Audio might be blocked until user gesture
    }
  }

  public static playWarningTone() {
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // ignored
    }
  }
}
