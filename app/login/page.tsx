"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AnimatePresence, domAnimation, LazyMotion, m } from "framer-motion";
import { Icon } from "@iconify/react";
import { Eye, EyeOff } from "lucide-react";

export default function Component() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [email, setEmail] = React.useState("example@mail.com");
  const [password, setPassword] = React.useState("");
  const [[page, direction], setPage] = React.useState([0, 0]);
  const [isEmailValid, setIsEmailValid] = React.useState(true);
  const [isPasswordValid, setIsPasswordValid] = React.useState(true);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 20 : -20,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.length) {
      setIsEmailValid(false);

      return;
    }
    setIsEmailValid(true);
    paginate(1);
  };

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password.length) {
      setIsPasswordValid(false);

      return;
    }
    setIsPasswordValid(true);
  };

  const handleSubmit = page === 0 ? handleEmailSubmit : handlePasswordSubmit;

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="rounded-lg bg-card shadow-sm flex w-full max-w-sm flex-col gap-4 px-8 pt-6 pb-10">
        <LazyMotion features={domAnimation}>
          <m.div layout className="flex min-h-[40px] items-center gap-2 pb-2">
            {page === 1 && (
              <m.div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => paginate(-1)}
                        className="h-8 w-8 p-0"
                      >
                        <Icon
                          className="text-muted-foreground"
                          icon="solar:alt-arrow-left-linear"
                          width={16}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Go back</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </m.div>
            )}
            <m.h1
              layout
              className="text-xl font-medium"
              transition={{ duration: 0.25 }}
            >
              Log In
            </m.h1>
          </m.div>
          <AnimatePresence custom={direction} initial={false} mode="wait">
            <m.form
              key={page}
              animate="center"
              className="flex flex-col gap-3"
              custom={direction}
              exit="exit"
              initial="enter"
              transition={{
                duration: 0.25,
              }}
              variants={variants}
              onSubmit={handleSubmit}
            >
              {page === 0 ? (
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setIsEmailValid(true);
                      setEmail(e.target.value);
                    }}
                    className={!isEmailValid ? "border-destructive" : ""}
                  />
                  {!isEmailValid && (
                    <p className="text-sm text-destructive">
                      Enter a valid email
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      type={isVisible ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setIsPasswordValid(true);
                        setPassword(e.target.value);
                      }}
                      className={!isPasswordValid ? "border-destructive" : ""}
                    />
                    <button
                      type="button"
                      onClick={toggleVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {!isPasswordValid && (
                    <p className="text-sm text-destructive">
                      Enter a valid password
                    </p>
                  )}
                </div>
              )}

              <Button className="w-full" type="submit">
                {page === 0 ? "Continue with Email" : "Log In"}
              </Button>
            </m.form>
          </AnimatePresence>
        </LazyMotion>
        <p className="text-sm text-center">
          <Link href="#" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </p>
        <div className="flex items-center gap-4 py-2">
          <Separator className="flex-1" />
          <p className="text-xs text-muted-foreground shrink-0">OR</p>
          <Separator className="flex-1" />
        </div>
        <div className="flex flex-col gap-2">
          <Button variant="outline" className="w-full">
            <Icon icon="flat-color-icons:google" width={24} />
            Continue with Google
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              window.location.href = "http://localhost:8080/auth/github/login";
            }}
          >
            <Icon
              className="text-muted-foreground"
              icon="fe:github"
              width={24}
            />
            Continue with Github
          </Button>
        </div>
        <p className="text-sm text-center">
          Need to create an account?&nbsp;
          <Link href="#" className="text-sm text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
